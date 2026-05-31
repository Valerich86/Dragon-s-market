import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  let startDateUTC = "";
  let endDateUTC = "";

  if (startDate) {
    const date = new Date(startDate);
    startDateUTC = date.toISOString(); // оставляем как есть — начало дня
  }

  if (endDate) {
    const date = new Date(endDate);
    date.setHours(22, 0, 0, 0); // устанавливаем 22:00:00.000
    endDateUTC = date.toISOString();
  }
  console.log(status, startDate, endDate)
  try {
    const data = await pool.query(
      `SELECT o.*, c.first_name, c.last_name, c.phone, c.email 
      FROM orders o JOIN customers c ON o.customer_id=c.id 
      WHERE o.status = $1 AND o.created_at >= $2 AND o.created_at <= $3 
      ORDER BY o.created_at DESC`,
      [status, startDateUTC, endDateUTC],
    );
    return NextResponse.json({ orders: data.rows });
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
