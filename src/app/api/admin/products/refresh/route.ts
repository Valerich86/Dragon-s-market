import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

type Price = {
  price: number;
  [key: string]: any;
};

type Remain = {
  remain: number;
  [key: string]: any;
};

type Product = {
  id: number;
  unit: string;
  weight: number;
  type: number;
  prices: Price[];
  remains: Remain[];
  [key: string]: any;
};

const host_name = process.env.HOST_NAME;

async function auth() {
  try {
    const url = `${host_name}/api/auth`;
    const headers = {
      "X-Auth-User": process.env.X_AUTH_USER || "",
      "X-Auth-Key": process.env.X_AUTH_KEY || "",
    };
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (response.status === 204) {
      const authToken = response.headers.get("X-Auth-Token");
      const expireToken = response.headers.get("X-Expire-Auth-Token");
      return {
        success: true,
        authToken: authToken,
        expireToken: expireToken,
        error: "",
      };
    } else if (response.status === 403) {
      const authError =
        response.headers.get("X-Auth-Error") ||
        "Неизвестная ошибка аутентификации";
      return { success: false, error: authError };
    }
  } catch (error) {
    return {
      success: false,
      error: "Не удалось выполнить запрос к внешнему API",
    };
  }
}

export async function GET() {
  try {
    const authResult = await auth();
    if (authResult?.success) {
      let newItems = 0;
      let updatedRemains = 0;
      let offset = 0;
      const iterations = 15;
      const authToken = authResult.authToken;
      const headers = { "X-Auth-Token": authToken || "" };
      for (let i = 0; i < iterations; i++) {
        console.log("offset: ", offset);
        const url = `${host_name}/api/query/itemsExpanded?offset=${offset}&types=1,2,3,4,5,6,7,8,9,10,11,12,15,16,18,21,22,23,25,26,28,30,31&order=id&withMoves=1`;
        const response = await fetch(url, {
          method: "GET",
          headers: headers,
        });
        if (response.ok) {
          const data = await response.json();
          const products: Product[] = data.items;
          console.log(`Получено ${products.length} товаров`);
          try {
            await pool.query("BEGIN");
            for (let p of products) {
              const result = await pool.query(
                `SELECT remains FROM products WHERE id=$1`,
                [p.id],
              );
              if (
                result.rows.length > 0 &&
                result.rows[0].remains !== p.remains[0].remain
              ) {
                await pool.query(`UPDATE products SET remains=$1 WHERE id=$2`, [
                  p.remains[0].remain,
                  p.id,
                ]);
                updatedRemains += 1;
              } else if (result.rows.length === 0) {
                const categoryId = p.type ?? 0;
                await pool.query(
                  `INSERT INTO products (id, name, weight, unit, category_id, price, remains) 
                  VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                  [
                    p.id,
                    p.name,
                    p.weight,
                    p.unit,
                    categoryId,
                    p.prices[0].price,
                    p.remains[0].remain,
                  ],
                );
                newItems += 1;
              }
            }
            await pool.query("COMMIT");
          } catch (error) {
            await pool.query("ROLLBACK");
            return NextResponse.json({
              status: 500,
              error: error,
            });
          }
        } else {
          return NextResponse.json({
            status: response.status,
            error: `Внешний API вернул статус ${response.status}`,
            message: "Ошибка внешнего API при обращении за товарами",
          });
        }
        offset += 100;
        console.log("newItems: ", newItems);
        console.log("updatedRemains: ", updatedRemains);
      }
      return NextResponse.json({
        status: 200,
        newItems: newItems,
        updatedRemains: updatedRemains,
      });
    } else {
      return NextResponse.json({
        status: 500,
        error: authResult?.error,
        message: "Ошибка внешнего API при аутентификации",
      });
    }
  } catch (error) {
    console.error("Критическая ошибка при запросе к внешнему API:", error);
    return NextResponse.json({
      status: 500,
      error: `Ошибка сервера`,
      message: "Не удалось выполнить запрос к внешнему API",
    });
  }
}
