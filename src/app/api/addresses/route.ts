import { z } from "zod";
import { pool } from "@/lib/db";
import { NextResponse } from "next/server";
import type { Address } from "@/lib/types";
import { validateAndSanitize } from "@/lib/validation";

export const AddressFormSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  city: z
    .string()
    .trim()
    .min(1, "Введите значение")
    .max(30, "Слишком длинное значение")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  street: z
    .string()
    .trim()
    .min(1, "Введите значение")
    .max(30, "Слишком длинное значение")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  house: z
    .string()
    .trim()
    .min(1, "Введите значение")
    .max(20, "Слишком длинное значение")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  entrance: z
    .string()
    .trim()
    .min(1, "Введите значение")
    .max(20, "Слишком длинное значение")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  floor: z
    .string()
    .trim()
    .optional()
    .nullable()
    .default(null)
    .refine(
      (value) => {
        if (value === null || value === undefined || value === "") return true;
        const num = parseInt(value, 10);
        return !isNaN(num) && num >= 0 && num <= 999;
      },
      {
        message: "Этаж должен быть числом от 0 до 999",
      },
    ),
  apartment: z
    .string()
    .trim()
    .min(1, "Введите значение")
    .max(20, "Слишком длинное значение")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  intercom_number: z
    .string()
    .trim()
    .max(20, "Слишком длинное значение")
    .optional()
    .default("")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  additional_info: z
    .string()
    .trim()
    .max(500, "Дополнительная информация не может быть длиннее 500 символов")
    .optional()
    .default("")
    .refine((value) => /^[а-яА-ЯёЁa-zA-Z0-9\s\-]+$/.test(value), {
      message: "Есть недопустимые символы",
    }),
  is_default: z.boolean().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = await AddressFormSchema.safeParseAsync(body);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return NextResponse.json({ errors: errors }, { status: 400 });
  }

  const {
    customer_id,
    city,
    street,
    house,
    entrance,
    floor,
    apartment,
    intercom_number,
    additional_info,
  } = validatedFields.data;

  try {
    await pool.query("BEGIN");
    const result = await pool.query(
      `INSERT INTO addresses 
      (customer_id, street, house, entrance, floor, apartment, intercom_number, additional_info, city)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        customer_id,
        street,
        house,
        entrance,
        floor,
        apartment,
        intercom_number,
        additional_info,
        city,
      ],
    );
    if (!result.rows || result.rows.length === 0) {
      throw new Error("Не удалось добавить адрес");
    }

    const { id } = result.rows[0];
    const data = await pool.query(
      `SELECT * FROM addresses WHERE customer_id=$1`,
      [customer_id],
    );
    const allAddresses: Address[] = data.rows;
    for (let a of allAddresses) {
      await pool.query(`UPDATE addresses SET is_default=$1 WHERE id=$2`, [
        a.id === id ? true : false,
        a.id,
      ]);
    }
    const consent = await pool.query(
      `SELECT * FROM consent_ppd WHERE customer_id=$1 AND purpose=$2`,
      [customer_id, "Для использования функций заказа и доставки товара"],
    );

    if (!consent || consent.rows.length === 0) {
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
      await pool.query(
        `INSERT INTO consent_ppd (customer_id, values, purpose, ip_address)
      VALUES ($1, $2, $3, $4)`,
        [
          customer_id,
          "Имя, фамилия, номер телефона, адреса, IP-адрес",
          "Для использования функций заказа и доставки товара",
          ip,
        ],
      );
    }
    await pool.query("COMMIT");
    return NextResponse.json({ status: 201 });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Ошибка добавления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
