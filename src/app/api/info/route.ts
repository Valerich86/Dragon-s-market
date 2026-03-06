import { NextResponse, NextRequest } from 'next/server';
import { info } from '@/lib/data/info';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { type, limitStr } = Object.fromEntries(searchParams.entries());

    let newData = info;
    if (type) {
      newData = info.filter(item => item.type === type);
    }
    
    let limit: number | null = null;
    if (limitStr) {
      const parsedLimit = parseInt(limitStr, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
      }
    }

    // Ограничиваем по limit (если указан и валиден)
    if (limit !== null) {
      newData = newData.slice(0, limit);
    }
    
    return NextResponse.json(
      {
        success: true,
        data: newData
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

