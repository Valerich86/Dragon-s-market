import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { auth } from "../../products/refresh/route";

type ProductType = {
  id: number;
  name: string;
};

const host_name = process.env.HOST_NAME;

export async function GET(request: NextRequest) {
  try {
    const authResult = await auth();
    if (authResult?.success) {
      const authToken = authResult.authToken;
      const headers = { "X-Auth-Token": authToken || "" };
      const url = `${host_name}/api/query/productTypes`;
      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      if (response.ok) {
        const data = await response.json();
        const categories: ProductType[] = data.types;
        // await pool.query("BEGIN");
        // for (let c of categories) {
        //   const name = c.name === "Брелки" ? "Брелоки" : c.name;
        //   await pool.query(
        //     `INSERT INTO categories (id, name) VALUES ($1, $2)`,
        //     [c.id, name],
        //   );
        // }
        // await pool.query("COMMIT");
        return NextResponse.json({
          status: 200,
          data: categories
        });
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
