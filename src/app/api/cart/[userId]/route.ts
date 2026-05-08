import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const {userId} = await params;
  const numId = Number(userId);
  try {
    const result = await pool.query(
      `DELETE FROM cart_items WHERE customer_id=$1`,
      [numId],
    );
    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function PUT(req: Request) {
  const {customer_id, product_id, price, k} = await req.json();
  const numCustomerId = Number(customer_id);
  const numProductId = Number(product_id);
  const numPrice = Number(price);
  const numK = Number(k);
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