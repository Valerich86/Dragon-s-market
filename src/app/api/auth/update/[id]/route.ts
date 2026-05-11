import { z } from "zod";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { checkMemoryRateLimit } from "@/lib/memory-rate-limiter";
import { validateAndSanitize } from "@/lib/validation";

// проверка логина
async function checkPhoneAvailability(phone: string): Promise<boolean> {
  try {
    const data = await pool.query(`SELECT * FROM customers WHERE phone=$1`, [
      phone,
    ]);
    return data.rows.length === 0; // true, если номер свободен
  } catch (error) {
    console.error("Ошибка проверки телефона:", error);
    throw new Error("Ошибка проверки данных телефона.");
  }
}

const PhoneFormSchema = z.object({
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
    })
    .refine(
      async (value) => {
        const isAvailable = await checkPhoneAvailability(value);
        return isAvailable;
      },
      { message: "Данный номер уже используется" },
    ),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const { allowed, resetAfter } = checkMemoryRateLimit(ip, 5, 1);
    console.log("allowed: ", allowed)
    console.log("resetAfter: ", resetAfter)
    const validationResult = validateAndSanitize(id); 
    if (!validationResult.isSafe || !allowed) {
      await pool.query(
        `INSERT INTO security_logs (ip_address, action, timestamp, details)
            VALUES ($1, $2, NOW(), $3)`,
        [
          ip,
          !allowed ? "попытка брутфорса" : validationResult.error,
          JSON.stringify({
            endpoint: "/api/auth/update/",
            userAgent: request.headers.get("user-agent"),
          }),
        ],
      );
      return NextResponse.json(
        { errors: {phone: [!allowed ? `Слишком много попыток. Повторите через ${resetAfter} секунд.` : validationResult.error]} },
        { status: 400 },
      );
    }

    const cleanedId = Number(validationResult.cleanedValue);

    const body = await request.json();
    const validatedFields = await PhoneFormSchema.safeParseAsync(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { phone } = validatedFields.data;

    await pool.query(`UPDATE customers SET phone=$1 WHERE id=$2`, [
      phone,
      cleanedId,
    ]);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return NextResponse.json(
      { error: "Не удалось зарегистрировать пользователя" },
      { status: 500 },
    );
  }
}
