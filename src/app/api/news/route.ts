import { NextResponse } from 'next/server';
import { news } from '@/lib/data/news';

export async function GET() {
  try {
    // В реальном приложении здесь будет запрос к БД:
    // const products = await db.products.findMany();

    return NextResponse.json(
      {
        success: true,
        data: news
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка сервера:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Ошибка на сервере',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

