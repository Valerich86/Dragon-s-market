import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;
  const numId = Number(id);
  try {
    const result = await pool.query(
      `DELETE FROM content WHERE id=$1`,
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

