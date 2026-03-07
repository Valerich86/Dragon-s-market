import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const data = await pool.query("SELECT * FROM categories ORDER BY name ASC");

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

