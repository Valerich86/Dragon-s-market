import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { RegistrationSchema } from "@/lib/validation";
import { verifyCaptcha } from "@/lib/captcha";
import { generateVerificationCode, sendEmail } from "@/lib/email-service";

// проверка логина
async function checkEmailAvailability(email: string): Promise<boolean> {
  try {
    const data = await pool.query(`SELECT * FROM customers WHERE email=$1`, [
      email,
    ]);
    console.log(data.rows[0]);
    return data.rows.length === 0;
  } catch (error) {
    throw new Error("Ошибка проверки данных почты.");
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
    const validatedFields = await RegistrationSchema.safeParseAsync(body);

    if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors);
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const {
      first_name,
      last_name,
      phone,
      password,
      email,
      verificationCode,
      captchaToken,
    } = validatedFields.data;
    // ПРОВЕРКА reCAPTCHA ПЕРЕД ПРОВЕРКОЙ УЧЁТНЫХ ДАННЫХ
    if (!verificationCode) {
      // Проверяем CAPTCHA только на первом этапе (до отправки кода)
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
    }

    const emailIsAvailable = await checkEmailAvailability(email);
    if (!emailIsAvailable) {
      return NextResponse.json(
        { errors: { email: ["Этот email уже зарегистрирован"] } },
        { status: 400 },
      );
    }

    // Если нет кода подтверждения — отправляем его
    if (!verificationCode) {
      const code = generateVerificationCode();

      // Сохраняем код и данные пользователя во временной таблице
      await pool.query(
        `INSERT INTO temp_auth_codes (email, code, expires_at, ip_address, purpose)
        VALUES ($1, $2, NOW() + INTERVAL '10 minutes', $3, 'register')`,
        [email.toLowerCase(), code, ip],
      );

      // Отправляем код на email
      const emailSent = await sendEmail(email, "auth-code", code);

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
      if (!/^\d{6}$/.test(verificationCode)) {
        return NextResponse.json(
          { errors: { verificationCode: ["Должно быть 6 цифр"] } },
          { status: 400 },
        );
      }
      // ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА reCAPTCHA НА ВТОРОМ ЭТАПЕ (опционально)
      if (captchaToken) {
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
      }
      // Проверяем существование и валидность кода в БД
      const result = await pool.query(
        `SELECT * FROM temp_auth_codes
         WHERE email = $1 AND code = $2 AND expires_at > NOW() AND purpose='register'`,
        [email.toLowerCase(), verificationCode],
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: "Неверный или просроченный код подтверждения" },
          { status: 400 },
        );
      }

      // Переносим пользователя в основную таблицу
      const userResult = await pool.query(
        `INSERT INTO customers (first_name, last_name, phone, password, email)
         VALUES ($1, $2, $3, $4, $5) RETURNING id, role`,
        [
          first_name,
          last_name,
          phone,
          await bcrypt.hash(password, 10),
          email.toLowerCase(),
        ],
      );

      if (!userResult.rows || userResult.rows.length === 0) {
        throw new Error("Не удалось создать пользователя");
      }

      const { id, role } = userResult.rows[0];

      // Удаляем временную запись
      await pool.query(`DELETE FROM temp_users WHERE email = $1`, [
        email.toLowerCase(),
      ]);

      // Создаём токен сессии
      const token = await createSessionToken(id, role);

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

      const response = NextResponse.json({ success: true });

      response.cookies.set({
        name: "dragon_bazar_session", // Отдельное имя cookie для админов
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 120, // 120 дней
        path: "/",
        sameSite: "strict",
      });

      return response;
    }
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return NextResponse.json(
      { error: "Не удалось зарегистрировать пользователя" },
      { status: 500 },
    );
  }
}
