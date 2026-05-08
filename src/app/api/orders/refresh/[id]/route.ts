import { pool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
  try {
    const data = await pool.query(`SELECT status FROM orders WHERE id=$1`, [numId])
    return NextResponse.json({ orderStatus: data.rows[0].status }, { status: 200 });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}