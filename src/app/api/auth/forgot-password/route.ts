import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { EmailPhoneSchema } from "@/lib/validation";
import { verifyCaptcha } from "@/lib/captcha";
import { generateVerificationCode, sendEmail } from "@/lib/email-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedFields = await EmailPhoneSchema.safeParseAsync(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { phone, email, captchaToken } = validatedFields.data;
    if (!captchaToken) {
      return NextResponse.json(
        { errors: { captcha: ["Требуется подтверждение reCAPTCHA"] } },
        { status: 400 },
      );
    }

    const captchaValid = await verifyCaptcha(captchaToken);
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

    const user = await pool.query(
      `SELECT id, email FROM customers WHERE email = $1 AND phone=$2`,
      [email, phone],
    );

    if (user.rowCount === 0) {
      // Возвращаем общий ответ — не сообщаем, существует ли email
      return NextResponse.json(
        {
          message:
            "Если e-mail зарегистрирован, письмо для сброса пароля отправлено",
        },
        { status: 200 },
      );
    }
    const userId = user.rows[0].id;

    // 3. Генерация токена сброса
    const token = crypto.randomUUID();
    const hashedToken = await bcrypt.hash(token, 10);

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 час

    // 4. Сохранение токена в БД
    await pool.query(
      `INSERT INTO password_reset_tokens (customer_id, token, expires_at) VALUES ($1, $2, $3)
      ON CONFLICT (customer_id) DO UPDATE SET token = $2, expires_at = $3`,
      [userId, hashedToken, expiresAt],
    );

    // 5. Формирование ссылки для сброса
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password/${token}`;

    // 6. Отправка email
    const emailSent = await sendEmail(email, "reset-password", resetUrl);
    if (!emailSent) {
      return NextResponse.json(
        {
          errors: {
            email: ["Не удалось отправить письмо на указанный e-mail."],
          },
        },
        { status: 500 },
      );
    }

    // 7. Возврат ответа
    return NextResponse.json(
      {
        message:
          "Если e-mail зарегистрирован, письмо для сброса пароля отправлено",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ status: 500 });
  }
}
