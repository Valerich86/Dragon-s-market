"use server";

import { z } from "zod";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

const RegistrationFormSchema = z
  .object({
    id: z.number().optional(),
    city: z
      .string()
      .min(2, "Название города должно содержать минимум 2 символа")
      .max(100, "Название города не может быть длиннее 100 символов")
      .trim()
      .refine((value) => /^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(value), {
        message: "Город может содержать только буквы, пробелы и дефисы",
      }),
    street: z.string().trim().min(1, "Введите значение"),
    house: z.string().trim().min(1, "Введите значение"),
    entrance: z.string().trim().min(1, "Введите значение"),
    floor: z
      .string()
      .trim()
      .min(0, "Этаж не может быть отрицательным")
      .max(999, "Слишком большое значение этажа")
      .nullable()
      .optional()
      .default(null),
    apartment: z
      .string()
      .trim()
      .min(1, "Номер квартиры обязателен")
      .max(15, "Номер квартиры не может быть длиннее 15 символов")
      .regex(
        /^[0-9a-zA-Zа-яА-ЯёЁ\-\s]+$/,
        "Недопустимые символы в номере квартиры",
      ),
    intercom_number: z.string().trim().optional().default(""),
    additional_info: z.string().trim().optional().default(""),
    is_default: z.boolean()
  });

export async function POST(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const body = await req.json();
  const { userId } = await params;
  console.log(userId)
  console.log(Number(userId))
  const validatedFields = await RegistrationFormSchema.safeParseAsync(body);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return NextResponse.json(
      { errors: errors },
      { status: 400 },
    );
  }

  const {
    id,
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
      `INSERT INTO customer_addresses 
      (customer_id, street, house, entrance, floor, apartment, intercom_number, additional_info, city, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        Number(userId),
        street,
        house,
        entrance,
        floor,
        apartment,
        intercom_number,
        additional_info,
        city,
        is_default,
      ],
    );
    return NextResponse.json({status: 201})
  } catch (error) {
    console.error('Ошибка добавления данных:', error);
    return NextResponse.json({ status: 500 });
  }
}


export async function PUT(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const body = await req.json();
  const validatedFields = await RegistrationFormSchema.safeParseAsync(body);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    console.log(errors)
    return NextResponse.json(
      { errors: errors },
      { status: 400 },
    );
  }

  const {
    id,
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
      `UPDATE customer_addresses 
      SET street=$1, house=$2, entrance=$3, floor=$4, apartment=$5, 
      intercom_number=$6, additional_info=$7, city=$8, is_default=$9 WHERE id=$10`,
      [
        street,
        house,
        entrance,
        floor,
        apartment,
        intercom_number,
        additional_info,
        city,
        is_default,
        id
      ],
    );
    return NextResponse.json({status: 204});
  } catch (error) {
    console.error('Ошибка добавления данных:', error);
    return NextResponse.json({ status: 500 });
  }
}