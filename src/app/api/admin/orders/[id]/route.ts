import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  const numId = Number(id);
  const {status} = await request.json();
  try {
    const result = await pool.query(
      `UPDATE orders SET status=$1 WHERE id=$2`, [status, id]
    );
    return NextResponse.json({status: 200});
  } catch (error) {
    console.error("Ошибка изменения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}