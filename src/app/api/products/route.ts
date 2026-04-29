import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { categoryId, toCarousel, random, toAdmin } = Object.fromEntries(
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
    } else if (random) {
      query = `SELECT * FROM products WHERE remains>0 AND is_active=TRUE ORDER BY name ASC LIMIT 100`;
      params = [];
    } else if (toAdmin) {
      query = `SELECT * FROM products ORDER BY id ASC`;
      params = [];
    }else {
      query = `SELECT * FROM products WHERE remains>0 AND is_active=TRUE ORDER BY name ASC`;
      params = [];
    }
    const data = await pool.query(query, params);
    let result = data.rows;
    if (random) result = [...data.rows].sort(() => Math.random() - 0.5);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
