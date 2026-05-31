import { pool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const numId = Number(id);
  try {
    await pool.query(`BEGIN`);
    const orderData = await pool.query(
      `SELECT
      o.*,
      c.first_name,
      c.last_name,
      c.phone,
      c.email,
      a.city,
      a.address,
      a.street,
      a.house,
      a.entrance,
      a.floor,
      a.apartment,
      a.intercom_number,
      a.postal_code,
      a.additional_info
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      LEFT JOIN addresses a ON o.address_id = a.id
      WHERE o.id = $1;`,
      [numId],
    );
    const order = orderData.rows[0];
    const items = await pool.query(
      `SELECT oi.*, p.name AS product_name, p.weight AS product_weight, 
        p.unit AS product_unit, p.price AS product_price
        FROM order_items AS oi JOIN products AS p ON oi.product_id=p.id 
        WHERE oi.order_id=$1 ORDER BY oi.created_at`,
      [order.id],
    );
    await pool.query(`COMMIT`);
    return NextResponse.json({ order: order, items: items.rows }, { status: 200 });
  } catch (error) {
    await pool.query(`ROLLBACK`);
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
