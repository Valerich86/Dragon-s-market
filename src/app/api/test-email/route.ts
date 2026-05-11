import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "Тест SMTP из Next.js",
      text: "Это тестовое письмо из API Next.js.",
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      testUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Ошибка отправки тестового письма:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
