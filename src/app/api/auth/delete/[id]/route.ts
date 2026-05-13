import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM customers WHERE id=$1", [Number(id)]);
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: "dragon_bazar_session", // Отдельное имя cookie для админов
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // 120 дней
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
