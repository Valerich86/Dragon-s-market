import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const {description, composition, is_active, status} = await req.json();

  try {
    switch (status) {
      case "productOfADay":
        await pool.query(
          `UPDATE products SET status=$1 WHERE status=$2`, ["default", "productOfADay"]
        );
        break;
      default: break;
    }
    await pool.query(
      `UPDATE products SET description=$1, composition=$2, is_active=$3, status=$4 WHERE id=$5`,
      [description, composition, is_active, status, id ],
    );
    return NextResponse.json({status: 200});
  } catch (error) {
    console.error('Ошибка добавления данных:', error);
    return NextResponse.json({ status: 500 });
  }
}