import { pool } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export default async function POST (request: NextRequest) {
  const delivery_cost = 500;
    const assembly_cost = 100;
    const now = new Date();
    const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); 
    const expected_arrival_time = futureDate.toISOString();
}