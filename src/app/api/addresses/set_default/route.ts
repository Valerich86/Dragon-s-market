"use server";

import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const {id, userId} = await req.json();

  try {
    const data = await pool.query(
      `SELECT id FROM addresses WHERE customer_id=$1`, [Number(userId)]
    );
    for (let a of data.rows) {
      await pool.query(`UPDATE addresses SET is_default=$1 WHERE id=$2`, [a.id === id ? true : false, a.id]);
    }
    return NextResponse.json({status: 204});
  } catch (error) {
    console.error('Ошибка добавления данных:', error);
    return NextResponse.json({ status: 500 });
  }
}