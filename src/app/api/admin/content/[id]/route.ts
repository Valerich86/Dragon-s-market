import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, bucketName, useCloudPath } from "@/lib/cloud";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);

  try {
    // 1. Получаем информацию о записи перед удалением
    const contentResult = await pool.query(
      `SELECT media_url FROM content WHERE id = $1`,
      [numId]
    );

    if (contentResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Запись не найдена" },
        { status: 404 }
      );
    }

    const mediaUrl = contentResult.rows[0].media_url;

    // 2. Если есть медиафайл — удаляем его из облака
    if (mediaUrl) {
      try {
        // Извлекаем Key из media_url (убираем cloudPath и берём только имя файла)
        const cloudPath = useCloudPath();
        const key = mediaUrl.replace(cloudPath + "/", "");

        const deleteCommand = new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key
        });

        await s3Client.send(deleteCommand);
      } catch (deleteError) {
        console.error("Ошибка при удалении медиафайла из облака:", deleteError);
        // Не прерываем удаление записи из БД, если удаление из облака не удалось
      }
    }

    // 3. Удаляем запись из БД
    const deleteResult = await pool.query(
      `DELETE FROM content WHERE id = $1`,
      [numId]
    );

    if (deleteResult.rowCount === 0) {
      return NextResponse.json(
        { error: "Не удалось удалить запись" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Запись и медиафайл успешно удалены"
    });
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json(
      {
        status: 500,
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
