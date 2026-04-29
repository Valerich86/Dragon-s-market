import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ userId: string }> },) {
  const { userId } = await params;
  const { searchParams } = new URL(request.url);
  const bonus = searchParams.get('bonus');
  try {
    await pool.query(
      `UPDATE customers SET bonus_amount=bonus_amount+$1, 
      bonus_received=true WHERE id=$2`, 
      [Number(bonus), userId]
    );

    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}