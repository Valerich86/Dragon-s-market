import { NextResponse, NextRequest } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { type, limitStr } = Object.fromEntries(searchParams.entries());

    let limit: number | null = null;
    if (limitStr) {
      const parsedLimit = parseInt(limitStr, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = parsedLimit;
      }
    }

    // Формируем запрос в зависимости от наличия limit
    let query: string;
    let params: any[];

    if (limit !== null) {
      query = `SELECT * FROM info WHERE info_type = $1 ORDER BY created_at DESC LIMIT $2`;
      params = [type, limit];
    } else {
      // Если limit не указан или некорректен — просто не используем LIMIT
      query = `SELECT * FROM info WHERE info_type = $1 ORDER BY created_at DESC`;
      params = [type];
    }

    const data = await pool.query(query, params);

    return NextResponse.json(
      {
        success: true,
        data: data.rows
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


