import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import { AddressFormSchema } from "../route";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const validatedFields = await AddressFormSchema.safeParseAsync(body);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return NextResponse.json(
      { errors: errors },
      { status: 400 },
    );
  }

  const {
    city,
    street,
    house,
    entrance,
    floor,
    apartment,
    intercom_number,
    additional_info,
    is_default
  } = validatedFields.data;

  try {
    const result = await pool.query(
      `UPDATE addresses 
      SET street=$1, house=$2, entrance=$3, floor=$4, apartment=$5, 
      intercom_number=$6, additional_info=$7, city=$8 WHERE id=$9`,
      [
        street,
        house,
        entrance,
        floor,
        apartment,
        intercom_number,
        additional_info,
        city,
        id
      ],
    );
    return NextResponse.json({status: 200});
  } catch (error) {
    console.error('Ошибка добавления данных:', error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query("BEGIN");
    const result = await pool.query("DELETE FROM addresses WHERE id=$1 RETURNING customer_id", [id]);
    const data = await pool.query("SELECT id FROM addresses WHERE customer_id=$1", [result.rows[0].customer_id]);
    if (data.rowCount && data.rowCount > 0) {
      await pool.query("UPDATE addresses SET is_default=$1 WHERE id=$2", [true, data.rows[0].id]);
    }
    await pool.query("COMMIT");
    return NextResponse.json({ status: 204 });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}