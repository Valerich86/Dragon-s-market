import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM customers WHERE id=$1", [id]);
    return NextResponse.json({
      status: 204,
      headers: {
        "Set-Cookie":
          "dragon_bazar_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
