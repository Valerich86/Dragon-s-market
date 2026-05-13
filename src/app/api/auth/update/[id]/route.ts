import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { checkMemoryRateLimit } from "@/lib/memory-rate-limiter";
import { PhoneSchema } from "@/lib/validation";

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

    const body = await request.json();
    const validatedFields = await PhoneSchema.safeParseAsync(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { phone } = validatedFields.data;

    await pool.query(`UPDATE customers SET phone=$1 WHERE id=$2`, [
      phone,
      Number(id),
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
