import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const data = await pool.query(
      `SELECT * FROM addresses WHERE customer_id=$1 AND is_default=$2`,
      [userId, true],
    );
    return NextResponse.json({ defaultAddress: data.rows[0] });
  } catch (error) {
    return NextResponse.json({
      status: 500,
    });
  }
}
