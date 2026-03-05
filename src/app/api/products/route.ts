import { NextResponse } from 'next/server';
import productsData from "@/lib/data/products.json";

export async function GET() {
  try {
    // В реальном приложении здесь будет запрос к БД:
    // const products = await db.products.findMany();

    return NextResponse.json(
      {
        success: true,
        data: productsData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

