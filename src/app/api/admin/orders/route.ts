import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  try {
    const data = await pool.query(
      `SELECT * FROM orders WHERE status=$1 ORDER BY created_at DESC`,
      [status],
    );
    return NextResponse.json({orders: data.rows});
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}