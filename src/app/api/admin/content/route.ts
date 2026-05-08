import { NextResponse, NextRequest } from "next/server";
import { pool } from "@/lib/db";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, bucketName, useCloudPath } from "@/lib/cloud";
import { Content } from "@/lib/types";

async function uploadFileToCloud(
  file: File,
  fileName: string,
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const cloudPath = useCloudPath();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    ACL: "public-read",
  });
  await s3Client.send(command);
  return `${cloudPath}/${fileName}`;
}

function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const extension = originalName.split(".").pop();
  return `content/${timestamp}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Парсим form-data
    const formData = await request.formData();

    // Извлекаем текстовые поля
    const type = formData.get("type") as Content["type"];
    const title =
      formData.get("title")?.toString() !== ""
        ? formData.get("title")?.toString()
        : undefined;
    const info = formData.get("info")?.toString() || "";
    const link_href = formData.get("link_href")?.toString();
    const link_name = formData.get("link_name")?.toString();

    // Инициализируем поле для файла
    let media_url: string | undefined;

    const media = formData.get("media") as File | null;

    if (media) {
      const fileName = generateFileName(media.name);
      media_url = await uploadFileToCloud(media, fileName);
    }
    // Если файл отсутствует, media_url остаётся undefined

    // Формируем SQL‑запрос с возвратом всех полей
    const query = `
      INSERT INTO content (type, title, info, media_url, link_href, link_name)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
    `;

    const values = [type, title, info, media_url, link_href, link_name];

    // Выполняем запрос
    const result = await pool.query<Content>(query, values);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contentType = searchParams.get("contentType");
  try {
    const data = await pool.query(
      `SELECT * FROM content WHERE type=$1 ORDER BY created_at DESC`,
      [contentType],
    );
    return NextResponse.json({content: data.rows});
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get("type") as Content["type"];
    const title =
      formData.get("title")?.toString() !== ""
        ? formData.get("title")?.toString()
        : undefined;
    const info = formData.get("info")?.toString() || "";
    const link_href = formData.get("link_href")?.toString();
    const link_name = formData.get("link_name")?.toString();
    const id = formData.get("id");

    // Инициализируем поле для файла
    let media_url: string | undefined;
    const media = formData.get("media") as File | null;
    if (media) {
      const fileName = generateFileName(media.name);
      media_url = await uploadFileToCloud(media, fileName);
    } else {
      // Если файл не выбран — получаем текущий media_url из БД
      const currentMediaResult = await pool.query('SELECT media_url FROM content WHERE id = $1', [id]);
      if (currentMediaResult.rows.length > 0) {
        media_url = currentMediaResult.rows[0].media_url;
      }
    }
    const query = `
      UPDATE content SET type=$1, title=$2, info=$3, media_url=$4, link_href=$5, link_name=$6 WHERE id=$7;
    `;
    const values = [type, title, info, media_url, link_href, link_name, Number(id)];
    const result = await pool.query(query, values);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Ошибка изменения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
