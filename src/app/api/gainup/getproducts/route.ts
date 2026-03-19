import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

type Price = {
  price: number;
  [key: string]: any;
}

type Remain = {
  remain: number;
  [key: string]: any;
}

type Product = {
  id: number;
  unit: string;
  weight: number;
  type: number;
  prices: Price[];
  remains: Remain[];
  [key: string]: any;
}
// получение категорий 
export async function GET() {
  try {
    const host_name = process.env.HOST_NAME;
    const url = `${host_name}/api/query/itemsExpanded?offset=1100&types=1,2,3,4,5,6,7,8,9,10,11,12,15,16,18,21,22,23,25,26,28,30,31&order=id&withMoves=1`;
    const headers = {
      "X-Auth-Token": "4295586594806b5097e5ecbfdf13aff2431312b769530981",
    };
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (response.ok) {
      const data = await response.json();
      const products:Product[] = data.items;
      try {
        await pool.query("BEGIN");
        for (let p of products) {
          const categoryId = p.type ?? 0;
          await pool.query(
            `INSERT INTO products (id, name, weight, unit, category_id, price, remains) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
            [p.id, p.name, p.weight, p.unit, categoryId, p.prices[0].price, p.remains[0].remain]
          );
        }
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        return NextResponse.json({
          status: 500,
          error: error,
        });
      }
      return NextResponse.json({
        status: 200,
        message: `добавлено ${products.length} новых позиций`,
      });
    } else {
      return NextResponse.json({
        status: response.status,
        error: `Внешний API вернул статус ${response.status}`,
        message: "Ошибка внешнего API",
      });
    }
  } catch (error) {
    console.error("Критическая ошибка при запросе к внешнему API:", error);
    return NextResponse.json({
      status: 500,
      error: "Внутренняя ошибка сервера",
      message: "Не удалось выполнить запрос к внешнему API",
    });
  }
}