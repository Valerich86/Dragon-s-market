import { z } from "zod";
import { pool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import type { Order } from "@/lib/types";
import { validateAndSanitize } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const autoFetch = searchParams.get("autoFetch");
  const userId = searchParams.get("userId");
  const fetch = autoFetch
    ? `SELECT id FROM orders WHERE status=$1`
    : userId
      ? `SELECT * FROM orders WHERE customer_id=$1 ORDER BY created_at DESC`
      : `SELECT * FROM orders`;
  const params = autoFetch ? ["создан"] : userId ? [userId] : [];
  try {
    const data = await pool.query(fetch, params);
    return NextResponse.json({ orders: data.rows }, { status: 200 });
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const {
    customer_id,
    address_id,
    type,
    cart_items,
    total_items,
    total_sum,
    notes,
  } = await request.json();

  const validationResult = validateAndSanitize(notes);
  if (!validationResult.isSafe) {
    return NextResponse.json(
      { errors: validationResult.errors },
      { status: 400 },
    );
  }

  try {
    await pool.query("BEGIN");
    let orderItemsData = [];
    for (let cartItemId of cart_items) {
      const result = await pool.query(`SELECT * FROM cart_items WHERE id=$1`, [
        cartItemId,
      ]);
      orderItemsData.push(result.rows[0]);
    }
    await pool.query(`DELETE FROM cart_items WHERE customer_id=$1`, [
      customer_id,
    ]);
    const result = await pool.query(
      `INSERT INTO orders 
      (customer_id, address_id, type, cart_items, total_items, total_sum, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at`,
      [
        customer_id,
        address_id,
        type,
        cart_items,
        total_items,
        total_sum,
        notes,
      ],
    );
    const { id, created_at } = result.rows[0];
    for (let item of orderItemsData) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, total_price)
        VALUES ($1, $2, $3, $4)`,
        [id, item.product_id, item.quantity, item.total_price],
      );
    }
    await pool.query("COMMIT");
    return NextResponse.json({
      status: 201,
      orderId: id,
      createdAt: created_at,
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Ошибка добавления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
