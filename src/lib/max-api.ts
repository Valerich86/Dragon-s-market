// lib/max-api.ts

export interface MAXVerificationResponse {
  success: boolean;
  age?: number;
  userId?: string;
  expiresAt?: string;
  message?: string;
}

/**
 * Проверяет QR‑код через API MAX
 * @param qrCode Строка QR‑кода
 * @returns Результат верификации
 */
export async function verifyQRCodeWithMAX(qrCode: string): Promise<MAXVerificationResponse> {
  try {
    const response = await fetch(process.env.MAX_API_URL + '/verify-qr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MAX_API_KEY}`
      },
      body: JSON.stringify({ qrCode })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Преобразуем ответ MAX в наш формат
    if (data.valid) {
      return {
        success: true,
        age: data.age,
        userId: data.userId,
        expiresAt: data.expiresAt
      };
    } else {
      return {
        success: false,
        message: data.error || 'Недействительный QR-код'
      };
    }
  } catch (error) {
    console.error('MAX API error:', error);
    return {
      success: false,
      message: 'Ошибка связи с сервером MAX'
    };
  }
}
