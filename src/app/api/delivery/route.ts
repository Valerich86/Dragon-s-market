import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { type, items_sum } = await request.json();
  try {
    const delivery_cost = type === "доставка" ? 500 : 0;
    const assembly_cost = 100;
    const total_sum = delivery_cost + assembly_cost + +items_sum;
    const now = new Date();
    const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const expected_arrival_time =
      type === "доставка" ? futureDate.toISOString() : new Date().toISOString();
    
    return NextResponse.json({
      status: 201,
      deliveryData: {
        delivery_cost: delivery_cost,
        assembly_cost: assembly_cost,
        total_sum: total_sum,
        expected_arrival_time: expected_arrival_time,
      }
    });

  } catch (error) {
    console.error("Ошибка добавления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
