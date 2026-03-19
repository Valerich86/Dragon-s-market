"use server";

import { z } from "zod";
import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";

async function validateUserCredentials(phone: string, password: string): Promise<{
  isValid: boolean;
  userId?: string;
  userName?: string;
}> {
  try {
    const result = await pool.query(
      `SELECT id, first_name, password FROM customers WHERE phone = $1`,
      [phone]
    );

    if (result.rows.length === 0) {
      return { isValid: false }; // Пользователь не найден
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    return {
      isValid: isPasswordValid,
      userId: user.id,
      userName: user.first_name
    };
  } catch (error) {
    console.error("Ошибка проверки учётных данных:", error);
    throw new Error("Ошибка проверки данных авторизации.");
  }
}

const LoginFormSchema = z
  .object({
    phone: z
      .string()
      .regex(
        /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
        "Телефон должен соответствовать формату: +7XXXXXXXXXX или 8XXXXXXXXXX"
      )
      .transform((phone) => {
        const digits = phone.replace(/\D/g, "");
        if (digits.startsWith("8") || digits.startsWith("7")) {
          return `+7${digits.slice(1)}`;
        }
        return `+${digits}`;
      }),
    password: z.string().trim().min(4, "Минимум 4 символа")
  })
  .refine(
    async (data) => {
      const validationResult = await validateUserCredentials(data.phone, data.password);
      return validationResult.isValid;
    },
    {
      message: "Неверный телефон или пароль",
      path: ["phone"] // Ошибка будет привязана к полю телефона
    }
  );


export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = await LoginFormSchema.safeParseAsync(body);

  if (!validatedFields.success) {
    return NextResponse.json(
      { errors: validatedFields.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { phone, password } = validatedFields.data;

  try {
    const validationResult = await validateUserCredentials(phone, password);

    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: "Неверный телефон или пароль" },
        { status: 401 }
      );
    }

    // Создаём токен сессии
    const token = await createSessionToken(validationResult.userId!, validationResult.userName!);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Set-Cookie": `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=31536000`,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json(
      { error: "Ошибка авторизации" },
      { status: 500 }
    );
  }
}

