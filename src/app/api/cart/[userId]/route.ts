import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const {userId} = await params;
  const numId = Number(userId);
  try {
    const result = await pool.query(
      `DELETE FROM cart_items WHERE customer_id=$1`,
      [numId],
    );
    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}