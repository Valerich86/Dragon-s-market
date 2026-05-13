"use server";

import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import {
  generateVerificationCode,
  sendEmail,
} from "@/lib/email-service";
import { LoginSchema } from "@/lib/validation";
import { verifyCaptcha } from "@/lib/captcha";

async function validateUserCredentials(
  email: string,
  password: string,
): Promise<{
  isValid: boolean;
  userId?: number;
  userName?: string;
  passwordHash?: string;
}> {
  try {
    const result = await pool.query(
      `SELECT id, first_name, password FROM customers WHERE email = $1 AND role IN ('admin', 'superadmin')`,
      [email.toLowerCase()],
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
      passwordHash: user.password,
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
    const body = await req.json();
    const validatedFields = await LoginSchema.safeParseAsync(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { email, password, verificationCode, captchaToken } = validatedFields.data;
    if (!verificationCode) {
      if (!captchaToken) {
        console.log("Требуется подтверждение reCAPTCHA");
        return NextResponse.json(
          { errors: { captcha: ["Требуется подтверждение reCAPTCHA"] } },
          { status: 400 },
        );
      }
      const captchaValid = await verifyCaptcha(captchaToken, ip);
      if (!captchaValid.success) {
        return NextResponse.json(
          {
            errors: {
              captcha: [captchaValid.error],
            },
          },
          { status: 400 },
        );
      }
      const validationResult = await validateUserCredentials(email, password);

      if (!validationResult.isValid) {
        return NextResponse.json(
          { errors: { password: ["Недостаточно прав"] } },
          { status: 401 },
        );
      }

      // Генерируем код подтверждения
      const code = generateVerificationCode();

      // Сохраняем код во временной таблице
      await pool.query(
        `INSERT INTO temp_auth_codes (user_id, email, code, expires_at, ip_address, purpose)
         VALUES ($1, $2, $3, NOW() + INTERVAL '10 minutes', $4, 'admin_login')`,
        [validationResult.userId, email.toLowerCase(), code, ip],
      );

      // Отправляем код на email
      const emailSent = await sendEmail(email, "auth-code", code);

      if (!emailSent) {
        return NextResponse.json(
          {
            errors: {
              verificationCode: [
                "Не удалось отправить код подтверждения. Попробуйте позже.",
              ],
            },
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message:
            "Код подтверждения отправлен на ваш email. Он действителен 10 минут.",
          requiresVerification: true,
        },
        { status: 202 }, // Accepted — требуется подтверждение
      );
    }

    // Если код предоставлен — проверяем его
    if (verificationCode) {
      if (!/^\d{6}$/.test(verificationCode)) {
        return NextResponse.json(
          { errors: { verificationCode: ["Должно быть 6 цифр"] } },
          { status: 400 },
        );
      }
      // Проверяем существование и валидность кода в БД
      const result = await pool.query(
        `SELECT * FROM temp_auth_codes
         WHERE email = $1 AND code = $2 AND expires_at > NOW() AND purpose='admin_login'`,
        [email.toLowerCase(), verificationCode],
      );
      if (result.rows.length === 0) {
        return NextResponse.json(
          {
            errors: {
              verificationCode: ["Неверный или просроченный код подтверждения"],
            },
          },
          { status: 400 },
        );
      }

      const loginCode = result.rows[0];

      // Удаляем временную запись
      await pool.query(`DELETE FROM temp_auth_codes WHERE email = $1`, [
        email.toLowerCase(),
      ]);

      // Создаём токен сессии
      const token = await createSessionToken(loginCode.user_id, "admin");

      const response = NextResponse.json({ success: true });

      response.cookies.set({
        name: "dragon_bazar_session_admin", // Отдельное имя cookie для админов
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 1, // 1 день
        path: "/",
        sameSite: "strict",
      });

      return response;
    }
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json({ error: "Ошибка авторизации" }, { status: 500 });
  }
}
