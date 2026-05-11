import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { validateAndSanitize } from "@/lib/validation";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const validationResult = validateAndSanitize(id);
    if (!validationResult.isSafe) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1";
      await pool.query(
        `INSERT INTO security_logs (ip_address, action, timestamp, details)
        VALUES ($1, $2, NOW(), $3)`,
        [
          ip,
          validationResult.error,
          JSON.stringify({
            endpoint: "/api/auth/delete",
            userAgent: request.headers.get("user-agent"),
          }),
        ],
      );
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 },
      );
    }

    const cleanedId = Number(validationResult.cleanedValue);

    await pool.query("DELETE FROM customers WHERE id=$1", [cleanedId]);
    return NextResponse.json(
      { success: true }, // Тело ответа (может быть пустым объектом {})
      {
        status: 200, // Используем 200 OK вместо 204
        headers: {
          "Set-Cookie":
            "dragon_bazar_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
