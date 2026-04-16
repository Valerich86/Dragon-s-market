import { NextRequest, NextResponse } from 'next/server';
// import { verifyQRCodeWithMAX } from '@/lib/max-api'; 

// Тип для входящих данных
interface VerifyAgeRequest {
  qrCode: string;
}

// Основной обработчик POST‑запроса
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Парсим тело запроса
    const body: VerifyAgeRequest = await request.json();

    // Валидация входных данных
    if (!body.qrCode || typeof body.qrCode !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Некорректный QR-код. Убедитесь, что QR-код действителен и попробуйте снова.'
        },
        { status: 400 }
      );
    }

    const qrCode = body.qrCode.trim();

    // Базовая проверка формата QR‑кода (пример)
    if (qrCode.length < 10) {
      return NextResponse.json(
        {
          success: false,
          message: 'QR-код слишком короткий. Убедитесь, что код полностью виден в камере.'
        },
        { status: 400 }
      );
    }

    // Проверка через API MAX/Госуслуг
    const verificationResult = await verifyQRCodeWithMAX(qrCode);

    if (verificationResult.success) {
      if (!verificationResult.userId) verificationResult.userId = "unknown";
      if (!verificationResult.age) verificationResult.age = 0;
      // await saveAgeVerification(
      //   verificationResult.userId,
      //   verificationResult.age,
      //   qrCode
      // );

      return NextResponse.json({
        success: true,
        message: 'Возраст успешно подтверждён',
        data: {
          age: verificationResult.age,
          userId: verificationResult.userId,
          expiresAt: verificationResult.expiresAt
        }
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: verificationResult.message || 'Недействительный или устаревший QR‑код'
        },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('Age verification error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Внутренняя ошибка сервера. Попробуйте позже.'
      },
      { status: 500 }
    );
  }
}

// Заглушка для интеграции с API MAX
async function verifyQRCodeWithMAX(qrCode: string): Promise<{
  success: boolean;
  message?: string;
  age?: number;
  userId?: string;
  expiresAt?: string;
}> {
  // В реальном приложении:
  // 1. Отправьте qrCode на сервер MAX/Госуслуг через их API
  // 2. Получите ответ о валидности и возрасте пользователя
  // 3. Верните соответствующий объект
  // Пример ответа от MAX API (заглушка)
  if (qrCode.includes('/www.gosuslugi.ru')) {
    return {
      success: true,
      age: 25,
      userId: 'user123',
      expiresAt: new Date(Date.now() + 30 * 1000).toISOString() // +30 секунд
    };
  } else {
    return {
      success: false,
      message: 'QR-код недействителен или устарел'
    };
  }
}

// Функция сохранения результата верификации в БД
// async function saveAgeVerification(
//   userId: string,
//   age: number,
//   qrCode: string
// ): Promise<void> {
//   // Здесь должна быть логика сохранения в вашу БД
//   // Пример: await db.ageVerifications.create({ ... })
// }
