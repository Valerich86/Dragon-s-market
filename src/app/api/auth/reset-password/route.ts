import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { ResetPasswordSchema } from "@/lib/validation";
import { verifyCaptcha } from "@/lib/captcha";
import { generateVerificationCode, sendEmail } from "@/lib/email-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedFields = await ResetPasswordSchema.safeParseAsync(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { password, token, captchaToken } =
      validatedFields.data;
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

    // Ищем запись с токеном в БД
    const tokenResult = await pool.query(`
      SELECT customer_id, token AS hashed_token FROM password_reset_tokens
      WHERE expires_at > NOW()
    `);

    if (tokenResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, message: "Неверный или истёкший токен" },
        { status: 400 },
      );
    }

    let found = false;
    let customer_id: number | null = null;

    // Перебираем все записи и сравниваем хеши
    for (const row of tokenResult.rows) {
      const isMatch = await bcrypt.compare(token, row.hashed_token);
      if (isMatch) {
        found = true;
        customer_id = row.customer_id;
        break;
      }
    }

    if (!found || customer_id === null) {
      return NextResponse.json(
        { errors: { password: ["Неверный или истёкший токен"] } },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("BEGIN");

    try {
      await pool.query(`UPDATE customers SET password = $1 WHERE id = $2`, [
        hashedPassword,
        customer_id,
      ]);
      await pool.query(`DELETE FROM password_reset_tokens WHERE customer_id = $1`, [
        customer_id,
      ]);
      await pool.query("COMMIT");
    } catch (updateError) {
      await pool.query("ROLLBACK");
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: "Пароль успешно изменён. Теперь вы можете войти в систему.",
    });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ status: 500 });
  }
}
