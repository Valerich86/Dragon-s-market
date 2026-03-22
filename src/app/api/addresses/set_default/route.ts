"use server";

import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const {id, userId} = await req.json();

  try {
    const data = await pool.query(
      `SELECT id FROM customer_addresses WHERE customer_id=$1`, [Number(userId)]
    );
    for (let a of data.rows) {
      if (a.id === id) {
        await pool.query(`UPDATE customer_addresses SET is_default=true`);
      } else {
        await pool.query(`UPDATE customer_addresses SET is_default=false`);
      }
    }
    return NextResponse.json({status: 204});
  } catch (error) {
    console.error('Ошибка добавления данных:', error);
    return NextResponse.json({ status: 500 });
  }
}