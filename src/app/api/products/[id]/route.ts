import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await pool.query(`SELECT * FROM products WHERE id=$1`, [id]);
    return NextResponse.json(
      {
        success: true,
        data: data.rows[0],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
