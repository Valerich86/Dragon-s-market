import { NextResponse } from "next/server";
import productsData from "@/lib/data/products.json";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = productsData.find(item => (item.id.toString()) === id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Продукт не найден",
        },
        { status: 404 },
      );
    }
    
    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
