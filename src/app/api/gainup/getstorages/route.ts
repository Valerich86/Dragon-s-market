import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// получение складов
export async function GET() {
  try {
    const host_name = process.env.HOST_NAME;
    const url = `${host_name}/api/query/storages`;
    const headers = {
      "X-Auth-Token": "5df4840f09084741ec0657dc34de3c1889ab1b3a414bfcaf",
    };
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        status: 200,
        data: data
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
