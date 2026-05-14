import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { PrivacyPolicySchema } from "@/lib/validation";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = await PrivacyPolicySchema.safeParseAsync(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }
    const { text, site_url, email } = validatedFields.data;
    await pool.query(
      `UPDATE privacy_policy SET text=$1, site_url=$2, email=$3;`,
      [text, site_url, email],
    );
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ status: 500 });
  }
}
