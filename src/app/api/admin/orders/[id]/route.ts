import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { validateAndSanitize } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
          endpoint: "/api/admin/orders",
          userAgent: request.headers.get("user-agent"),
        }),
      ],
    );
    return NextResponse.json(
      { error: validationResult.error },
      { status: 400 },
    );
  }
  const numId = Number(validationResult.cleanedValue);
  const { status } = await request.json();
  try {
    const result = await pool.query(`UPDATE orders SET status=$1 WHERE id=$2`, [
      status,
      numId,
    ]);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Ошибка изменения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
