import { z } from "zod";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { checkMemoryRateLimit } from "@/lib/memory-rate-limiter";
import {
  generateVerificationCode,
  sendVerificationCode,
} from "@/lib/email-service";

// проверка логина
async function checkEmailAvailability(email: string): Promise<boolean> {
  try {
    const data = await pool.query(`SELECT * FROM customers WHERE email=$1`, [
      email,
    ]);
    return data.rows.length === 0;
  } catch (error) {
    throw new Error("Ошибка проверки данных почты.");
  }
}

const RegistrationFormSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(1, "Введите значение")
      .max(50, "Слишком длинное значение")
      .refine(
        (value) => {
          if (value.trim() === "") return true;
          return /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value);
        },
        {
          message: "Есть недопустимые символы",
        },
      ),
    last_name: z
      .string()
      .trim()
      .min(1, "Введите значение")
      .max(50, "Слишком длинное значение")
      .refine(
        (value) => {
          if (value.trim() === "") return true;
          return /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value);
        },
        {
          message: "Есть недопустимые символы",
        },
      ),
    phone: z
      .string()
      .regex(
        /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
        "Телефон должен соответствовать формату: +7XXXXXXXXXX или 8XXXXXXXXXX",
      )
      .transform((phone) => {
        const digits = phone.replace(/\D/g, "");
        if (digits.startsWith("8") || digits.startsWith("7")) {
          return `+7${digits.slice(1)}`;
        }
        return `+${digits}`;
      }),
    email: z
      .string()
      .trim()
      .email("Введите корректный email-адрес")
      .min(1, "Введите email")
      .max(254, "Email слишком длинный (максимум 254 символа)")
      .refine((value) => value.toLowerCase() === value, {
        message: "Email должен быть в нижнем регистре",
      })
      .refine(
        async (value) => {
          const isAvailable = await checkEmailAvailability(value.toLowerCase());
          return isAvailable;
        },
        { message: "Этот email уже зарегистрирован" },
      ),
    password: z
      .string()
      .trim()
      .min(8, "Пароль должен содержать минимум 8 символов")
      .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
      .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну прописную букву")
      .regex(/\d/, "Пароль должен содержать хотя бы одну цифру"),
    confirmPassword: z.string(),
    verificationCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

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
              endpoint: "/api/auth/register",
              resetAfter: resetAfter,
              userAgent: req.headers.get("user-agent"),
            }),
          ],
        );
      } catch (logError) {
        console.error("Ошибка логирования попытки брутфорса:", logError);
        // Продолжаем выполнение, даже если логирование не удалось
      }
      return NextResponse.json(
        {
          error: `Слишком много попыток. Повторите через ${resetAfter} секунд.`,
          resetAfter,
        },
        { status: 429 }, // HTTP 429 Too Many Requests
      );
    }

    const body = await req.json();
    const validatedFields = await RegistrationFormSchema.safeParseAsync(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { first_name, last_name, phone, password, email, verificationCode } =
      validatedFields.data;

    // Если нет кода подтверждения — отправляем его
    if (!verificationCode) {
      const code = generateVerificationCode();

      // Сохраняем код и данные пользователя во временной таблице
      await pool.query(
        `INSERT INTO temp_users (first_name, last_name, phone, password_hash, email, verification_code, verification_expires, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6, NOW() + INTERVAL '10 minutes', $7)
         ON CONFLICT (email) DO UPDATE
         SET verification_code = $6, verification_expires = NOW() + INTERVAL '10 minutes'`,
        [
          first_name,
          last_name,
          phone,
          await bcrypt.hash(password, 10),
          email.toLowerCase(),
          code,
          ip,
        ],
      );

      // Отправляем код на email
      const emailSent = await sendVerificationCode(email, code);

      if (!emailSent) {
        return NextResponse.json(
          {
            error: "Не удалось отправить код подтверждения. Попробуйте позже.",
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
      // Проверяем существование и валидность кода в БД
      const result = await pool.query(
        `SELECT * FROM temp_users
         WHERE email = $1 AND verification_code = $2 AND verification_expires > NOW()`,
        [email.toLowerCase(), verificationCode],
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Неверный или просроченный код подтверждения" },
          { status: 400 },
        );
      }

      const tempUser = result.rows[0];

      // Переносим пользователя в основную таблицу
      const userResult = await pool.query(
        `INSERT INTO customers (first_name, last_name, phone, password, email)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          tempUser.first_name,
          tempUser.last_name,
          tempUser.phone,
          tempUser.password_hash,
          email.toLowerCase(),
        ],
      );

      if (!userResult.rows || userResult.rows.length === 0) {
        throw new Error("Не удалось создать пользователя");
      }

      const { id } = userResult.rows[0];

      // Удаляем временную запись
      await pool.query(`DELETE FROM temp_users WHERE email = $1`, [
        email.toLowerCase(),
      ]);

      // Создаём токен сессии
      const token = await createSessionToken(id);

      // Логируем согласие на обработку данных
      await pool.query(
        `INSERT INTO consent_ppd (customer_id, values, purpose, ip_address)
         VALUES ($1, $2, $3, $4)`,
        [
          id,
          "Имя, фамилия, номер телефона, пароль, IP-адрес",
          "Для дальнейшей аутентификации пользователя и полноценного использования сайта",
          ip,
        ],
      );

      return NextResponse.json(
        { success: true },
        {
          status: 200,
          headers: {
            "Set-Cookie": `dragon_bazar_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=10368000`,
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return NextResponse.json(
      { error: "Не удалось зарегистрировать пользователя" },
      { status: 500 },
    );
  }
}
