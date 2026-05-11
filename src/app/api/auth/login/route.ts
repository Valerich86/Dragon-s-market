"use server";

import { z } from "zod";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { generateVerificationCode, sendVerificationCode } from "@/lib/email-service";
import { checkMemoryRateLimit } from "@/lib/memory-rate-limiter";
import { validateAndSanitize } from "@/lib/validation";

const LoginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
  verificationCode: z.string().optional(), // Код подтверждения (опционально на первом этапе)
});

async function validateUserCredentials(
  email: string,
  password: string,
): Promise<{
  isValid: boolean;
  userId?: number;
  userName?: string;
  passwordHash?: string; // Добавляем для проверки кода подтверждения
}> {
  try {
    const validationResult = validateAndSanitize(email);
    if (!validationResult.isSafe) return { isValid: false };

    const result = await pool.query(
      `SELECT id, first_name, password FROM customers WHERE email = $1`,
      [validationResult.cleanedValue?.toLowerCase()],
    );

    if (result.rows.length === 0) {
      return { isValid: false };
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    return {
      isValid: isPasswordValid,
      userId: user.id,
      userName: user.first_name,
      passwordHash: user.password, // Возвращаем хеш пароля
    };
  } catch (error) {
    console.error("Ошибка проверки учётных данных:", error);
    throw new Error("Ошибка проверки данных авторизации.");
  }
}


export async function POST(req: Request) {
  try {
    // Получаем IP клиента
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Проверяем лимит: 5 запросов за 1 минуту
    const { allowed, resetAfter } = checkMemoryRateLimit(ip, 5, 1);

    if (!allowed) {
      // Логируем попытку брутфорса в БД
      try {
        await pool.query(
          `INSERT INTO security_logs (ip_address, action, timestamp, details)
               VALUES ($1, $2, NOW(), $3)`,
          [
            ip,
            "попытка брутфорса",
            JSON.stringify({
              endpoint: "/api/auth/login",
              resetAfter: resetAfter,
              userAgent: req.headers.get("user-agent"),
            }),
          ],
        );
      } catch (logError) {
        console.error("Ошибка логирования попытки брутфорса:", logError);
      }
      return NextResponse.json(
        {
          error: `Слишком много попыток. Повторите через ${resetAfter} секунд.`,
          resetAfter,
        },
        { status: 429 },
      );
    }

    const body = await req.json();
    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Неверные данные формы" },
        { status: 400 },
      );
    }

    const { email, password, verificationCode } = validatedFields.data;

    // Если код не предоставлен — отправляем его
    if (!verificationCode) {
      const validationResult = await validateUserCredentials(email, password);

      if (!validationResult.isValid) {
        return NextResponse.json(
          { error: "Неверный email или пароль" },
          { status: 401 },
        );
      }

      // Генерируем код подтверждения
      const code = generateVerificationCode();

      // Сохраняем код во временной таблице
      await pool.query(
        `INSERT INTO temp_login_codes (user_id, email, code, expires_at, ip_address)
         VALUES ($1, $2, $3, NOW() + INTERVAL '10 minutes', $4)
         ON CONFLICT (email) DO UPDATE
         SET code = $3, expires_at = NOW() + INTERVAL '10 minutes'`,
        [validationResult.userId, email.toLowerCase(), code, ip],
      );

      // Отправляем код на email
      const emailSent = await sendVerificationCode(email, code);

      if (!emailSent) {
        return NextResponse.json(
          { error: "Не удалось отправить код подтверждения. Попробуйте позже." },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Код подтверждения отправлен на ваш email. Он действителен 10 минут.",
          requiresVerification: true,
        },
        { status: 202 }, // Accepted — требуется подтверждение
      );
    }

    // Если код предоставлен — проверяем его
    if (verificationCode) {
      // Проверяем существование и валидность кода в БД
      const result = await pool.query(
        `SELECT * FROM temp_login_codes
         WHERE email = $1 AND code = $2 AND expires_at > NOW()`,
        [email.toLowerCase(), verificationCode],
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Неверный или просроченный код подтверждения" },
          { status: 400 },
        );
      }

      const loginCode = result.rows[0];

      // Удаляем временную запись
      await pool.query(`DELETE FROM temp_login_codes WHERE email = $1`, [email.toLowerCase()]);

      // Создаём токен сессии
      const token = await createSessionToken(loginCode.user_id);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          "Set-Cookie": `dragon_bazar_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=10368000`,
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json({ error: "Ошибка авторизации" }, { status: 500 });
  }
}

