"use server";

import { z } from "zod";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { RegisterFormErrors } from "@/lib/types";

// проверка логина
async function checkPhoneAvailability(phone: string): Promise<boolean> {
  try {
    const data = await pool.query(`SELECT * FROM customers WHERE phone=$1`, [
      phone,
    ]);
    return data.rows.length === 0; // true, если номер свободен
  } catch (error) {
    console.error("Ошибка проверки телефона:", error);
    throw new Error("Ошибка проверки данных телефона.");
  }
}

const RegistrationFormSchema = z
  .object({
    first_name: z.string().trim().min(2, "Минимум 2 символа"),
    last_name: z.string().trim().min(2, "Минимум 2 символа"),
    phone: z
      .string()
      .regex(
        /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
        "Телефон должен соответствовать формату: +7XXXXXXXXXX или 8XXXXXXXXXX",
      )
      .transform((phone) => {
        const digits = phone.replace(/\D/g, "");
        if (digits.startsWith("8") || digits.startsWith("7")) {
          return `+7${digits.slice(1)}`;
        }
        return `+${digits}`;
      })
      .refine(
        async (value) => {
          const isAvailable = await checkPhoneAvailability(value);
          return isAvailable;
        },
        { message: "Данный номер уже используется" },
      ),
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
    password: z.string().trim().min(4, "Минимум 4 символа"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = await RegistrationFormSchema.safeParseAsync(body);

  if (!validatedFields.success) {
    return NextResponse.json(
      { errors: validatedFields.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const {
    first_name,
    last_name,
    phone,
    password,
    city,
    street,
    house,
    entrance,
    floor,
    apartment,
    intercom_number,
    additional_info,
  } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Используем транзакцию для атомарности
    await pool.query("BEGIN");

    // Первый запрос: создание пользователя
    const result = await pool.query(
      `INSERT INTO customers (first_name, last_name, phone, password)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [first_name, last_name, phone, hashedPassword],
    );

    if (!result.rows || result.rows.length === 0) {
      throw new Error("Не удалось создать пользователя");
    }

    const { id } = result.rows[0];

    // Второй запрос: добавление адреса
    const result2 = await pool.query(
      `INSERT INTO customer_addresses (customer_id, street, house, entrance, floor, apartment, intercom_number, additional_info, city, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [
        id,
        street,
        house,
        entrance,
        floor,
        apartment,
        intercom_number,
        additional_info,
        city,
        true,
      ],
    );

    // Фиксация транзакции
    await pool.query("COMMIT");

    // Создание токена сессии
    const token = await createSessionToken(id);

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Разраб накосячил. Сорян." }),
        { status: 406 },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=15552000`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Откат транзакции при ошибке
    await pool.query("ROLLBACK").catch(() => {});

    console.error("Ошибка регистрации:", error);

    return NextResponse.json(
      { error: "Не удалось зарегистрировать пользователя" },
      { status: 500 },
    );
  }
}
