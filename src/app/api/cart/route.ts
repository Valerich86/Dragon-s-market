import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const customer_id = searchParams.get("customer_id");
  const numCustomerId = Number(customer_id);

  try {
    const result = await pool.query(
      `SELECT ci.*, p.name AS product_name, p.weight AS product_weight, p.category_id as product_category,
        p.unit AS product_unit, p.price AS product_price, p.order_minimum AS product_minimum,
        p.remains AS product_remains, SUM(ci.total_price) OVER () AS cart_total
        FROM cart_items AS ci JOIN products AS p ON ci.product_id=p.id 
        WHERE ci.customer_id=$1 ORDER BY ci.created_at`,
      [numCustomerId],
    );
    return NextResponse.json(
      { cart: result.rows },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function POST(req: Request) {
  const { customer_id, product_id, price, k } = await req.json();
  const numCustomerId = Number(customer_id);
  const numProductId = Number(product_id);
  const numPrice = Number(price);
  const numK = Number(Number(k).toFixed(1));
  try {
    const result = await pool.query(
      `INSERT INTO cart_items (customer_id, product_id, quantity, total_price)
        VALUES ($1, $2, $3, $4) RETURNING quantity`,
      [numCustomerId, numProductId, numK, numPrice * numK],
    );
    return NextResponse.json({
      status: 201,
      quantity: result.rows[0].quantity,
    });
  } catch (error) {
    console.error("Ошибка добавления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function PUT(request: Request) {
  const { customer_id, product_id, price, k } = await request.json();
  const numCustomerId = Number(customer_id);
  const numProductId = Number(product_id);
  const numPrice = Number(price);
  const numK = Number(Number(k).toFixed(1));
  try {
    const result = await pool.query(
      `UPDATE cart_items 
      SET quantity=quantity+$4, total_price=(quantity+$4)*$1 
      WHERE customer_id=$2 AND product_id=$3 RETURNING id, quantity`,
      [numPrice, numCustomerId, numProductId, numK],
    );
    const newQuantity = result.rows[0].quantity;
    if (newQuantity === 0) {
      await pool.query(`DELETE FROM cart_items WHERE id=${result.rows[0].id}`);
    }
    return NextResponse.json({
      status: 200,
      quantity: newQuantity,
    });
  } catch (error) {
    console.error("Ошибка изменения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const customer_id = searchParams.get("customer_id");
  try {
    const result = await pool.query(
      `DELETE FROM cart_items WHERE customer_id=$1`,
      [Number(customer_id)],
    );
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}