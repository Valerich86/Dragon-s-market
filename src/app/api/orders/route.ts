import { pool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { textAreaValidation } from "@/lib/validation";
import { sendEmail } from "@/lib/email-service";

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
  // Проверяем время по Перми (UTC+5)
  const now = new Date();
  const utcOffset = 5; // Пермь: UTC+5
  const localTime = new Date(now.getTime() + utcOffset * 60 * 60 * 1000);

  const hours = localTime.getUTCHours(); // UTC‑часы соответствуют пермскому времени из‑за смещения

  if (hours < 10 || hours >= 22) {
    return NextResponse.json(
      {
        error:
          "Оформление заказов доступно с 10:00 до 22:00 по пермскому времени",
        availableFrom: "10:00",
        availableUntil: "22:00",
      },
      { status: 403 },
    );
  }

  try {
    const {
      customer_id,
      address_id,
      type,
      cart_items,
      items_amount,
      items_sum,
      delivery_cost,
      assembly_cost,
      total_sum,
      expected_arrival_time,
      notes,
    } = await request.json();

    const validationResult = textAreaValidation(notes, 500);
    if (!validationResult.isSafe) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 },
      );
    }

    await pool.query("BEGIN");
    let result = await pool.query(`SELECT email FROM customers WHERE id=$1`, [
      customer_id,
    ]);
    const email = result.rows[0].email;
    let orderItemsData = [];
    for (let cartItemId of cart_items) {
      result = await pool.query(`SELECT * FROM cart_items WHERE id=$1`, [
        cartItemId,
      ]);
      orderItemsData.push(result.rows[0]);
    }
    await pool.query(`DELETE FROM cart_items WHERE customer_id=$1`, [
      customer_id,
    ]);
    result = await pool.query(
      `INSERT INTO orders 
      (customer_id, address_id, type, items_amount, items_sum, delivery_cost, assembly_cost, total_sum, expected_arrival_time, notes )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, created_at`,
      [
        customer_id,
        address_id,
        type,
        items_amount,
        items_sum,
        delivery_cost,
        assembly_cost,
        total_sum,
        expected_arrival_time,
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
    // Отправляем код на email
    const emailSent = await sendEmail(email, "pay-link", `${total_sum}₽`, id);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Не удалось отправить ссылку на оплату. Попробуйте позже." },
        { status: 500 },
      );
    }
    return NextResponse.json({
      status: 201,
      orderId: id,
      message: `Создан новый заказ № ${id}. На e-mail "${email}" отправлена ссылка для оплаты.`
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Ошибка добавления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
