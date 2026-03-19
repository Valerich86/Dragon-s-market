import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

type ProductType = {
  id: number;
  name: string;
};

// получение категорий
export async function GET() {
  try {
    const host_name = process.env.HOST_NAME;
    const url = `${host_name}/api/query/productTypes`;
    const headers = {
      "X-Auth-Token": "5df4840f09084741ec0657dc34de3c1889ab1b3a414bfcaf",
    };
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const productTypes: ProductType[] = data.types;
      console.log(productTypes);
      try {
        await pool.query("BEGIN");
        for (let t of productTypes) {
          const name = (t.name === "Брелки") ? "Брелоки" : t.name;
          await pool.query(
            `INSERT INTO categories (id, name) VALUES ($1, $2)`,
            [t.id, name],
          );
        }
        await pool.query("COMMIT");
      } catch (error) {
        await pool.query("ROLLBACK");
        return NextResponse.json({
          status: 500,
          message: "Ошибка обновления данных",
        });
      }
      return NextResponse.json({
        status: 200,
        message: "Данные добавлены / обновлены",
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
