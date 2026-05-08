import type { UploadResponse, UploadedFile } from "@/lib/types";
import { s3Client, bucketName } from "@/lib/cloud";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// Вспомогательная функция для чтения файла из FormData
export async function getFileBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

// Валидация файла
export function validateFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5 МБ

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Неподдерживаемый тип файла" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Файл слишком большой (максимум 5 МБ)" };
  }

  return { valid: true };
}

export async function POST(request: Request) {
  try {
    // Получаем данные формы
    const formData = await request.formData();
    const files = formData.getAll("images") as unknown as File[];

    if (!files || files.length === 0) {
      return Response.json(
        {
          success: false,
          uploadedCount: 0,
          files: [],
          error: "Нет файлов для загрузки",
        } as UploadResponse,
        { status: 400 },
      );
    }

    const uploadedFiles: UploadedFile[] = [];
    let uploadedCount = 0;

    for (const file of files) {
      try {
        // Валидируем файл
        const validation = validateFile(file);
        if (!validation.valid) {
          console.warn(
            `Валидация файла ${file.name} не пройдена: ${validation.error}`,
          );
          continue;
        }

        // Читаем файл
        const fileBuffer = await getFileBuffer(file);

        const fileName = `products/${file.name}`;

        // Загружаем в S3
        await s3Client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: file.type,
            ACL: 'public-read',
          }),
        );

        uploadedFiles.push({
          originalName: file.name,
          storedName: fileName,
          size: file.size,
          url: `${process.env.VK_CLOUD_ENDPOINT}/${bucketName}/${fileName}`,
        });
        uploadedCount++;
      } catch (fileError) {
        console.error(`Ошибка загрузки файла ${file.name}:`, fileError);
        // Продолжаем загрузку остальных файлов
      }
    }

    return Response.json({
      success: true,
      uploadedCount,
      files: uploadedFiles,
    } satisfies UploadResponse);
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return Response.json(
      {
        success: false,
        uploadedCount: 0,
        files: [],
        error: "Ошибка сервера при загрузке файлов",
      } as UploadResponse,
      { status: 500 },
    );
  }
}
