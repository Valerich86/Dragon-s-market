import { NextRequest, NextResponse } from "next/server";
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

export async function auth() {
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  try {
    const authResult = await auth();
    if (authResult?.success) {
      let newItems = 0;
      let updated = 0;
      const authToken = authResult.authToken;
      const headers = { "X-Auth-Token": authToken || "" };
      const url = `${host_name}/api/query/itemsExpanded?types=${categoryId}&order=id&withMoves=1`;
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      if (response.ok) {
        const data = await response.json();
        let allProducts: Product[] = data.items;
        let products: Product[] = data.items;
        let offset = 0;
        while (products.length === 100) {
          offset += 100;
          const url = `${host_name}/api/query/itemsExpanded?offset=${offset}&types=${categoryId}&order=id&withMoves=1`;
          const response = await fetch(url, {
            method: "GET",
            headers: headers,
          });
          const data = await response.json();
          products = data.items;
          allProducts.push(...products);
        }
        try {
          await pool.query("BEGIN");
          for (let p of allProducts) {
            const result = await pool.query(
              `SELECT remains, name, price FROM products WHERE id=$1`,
              [p.id],
            );

            // если товар есть в БД и значения полей отличаются, обновляем
            if (
              result.rows.length > 0 &&
              (result.rows[0].remains !== p.remains[0].remain ||
                result.rows[0].name !== p.name ||
                Number(result.rows[0].price) !== Number(p.prices[0].price))
            ) {
              try {
                await pool.query(
                  `UPDATE products SET remains=$1, name=$2, price=$3 WHERE id=$4`,
                  [p.remains[0].remain, p.name, p.prices[0].price, p.id],
                );
                updated += 1;
              } catch (error) {
                return NextResponse.json({
                  status: 500,
                  error: `Ошибка обновления товара: ${error}`,
                });
              }

            // если товара нет в БД, добавляем
            } else if (result.rows.length === 0) {
              const categoryId = p.type ?? 0;
              try {
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
              } catch (error) {
                return NextResponse.json({
                  status: 500,
                  error: `Ошибка добавления товара: ${error}`,
                });
              }
            }
          }
          await pool.query("COMMIT");
          return NextResponse.json({
            status: 200,
            newItems: newItems,
            updated: updated,
          });
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
          error: `Внешний API вернул статус ${response.status} (ошибка при обновлении). `,
        });
      }
    } else {
      return NextResponse.json({
        status: 500,
        error: `Ошибка внешнего API при аутентификации : ${authResult?.error}`,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: `Критическая ошибка при запросе к внешнему API: ${error}`,
    });
  }
}
