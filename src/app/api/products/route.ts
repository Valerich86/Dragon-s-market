import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { categoryId, toCarousel } = Object.fromEntries(
      searchParams.entries(),
    );
    let query: string;
    let params: any[];

    if (toCarousel) {
      query = `SELECT * FROM products WHERE to_carousel=TRUE AND is_active=TRUE AND remains>0 ORDER BY name ASC`;
      params = [];
    } else if (categoryId !== undefined) {
      query = `SELECT * FROM products WHERE category_id=$1 AND is_active=TRUE AND remains>0 ORDER BY name ASC`;
      params = [categoryId];
    } else {
      console.log ("response")
      query = `SELECT * FROM products WHERE remains>0 ORDER BY name ASC`;
      params = [];
    }
    const data = await pool.query(query, params);

    return NextResponse.json(
      {
        success: true,
        data: data.rows,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
