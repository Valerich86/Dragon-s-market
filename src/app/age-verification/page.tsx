"use client";

import QRScannerJSQR from "@/components/qr-scanner";
import CustomButton from "@/components/UI/custom-button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AgeVerificationPage() {
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: {
      age: number;
      userId: string;
      expiresAt: string;
    };
  } | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const router = useRouter();

  const handleSuccess = async (qrData: string) => {
    setHasScanned(true);
    setIsVerifying(true);

    try {
      const response = await fetch("/api/auth/verify-age", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode: qrData }),
      });

      const verification = await response.json();

      if (verification.success) {
        setResult({
          success: true,
          message: "Возраст успешно подтверждён!",
          data: verification.data,
        });
      } else {
        setResult({
          success: false,
          message:
            verification.message ||
            "Недействительный QR‑код. Попробуйте снова.",
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setResult({
        success: false,
        message:
          "Ошибка при проверке QR‑кода. Проверьте подключение к интернету.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleError = (message: string) => {
    setResult({
      success: false,
      message,
    });
  };

  const resetScanner = () => {
    setResult(null);
    setHasScanned(false);
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center x-spacing">
      {!hasScanned ? (
        <div>
          <QRScannerJSQR onSuccess={handleSuccess} onError={handleError} />
        </div>
      ) : (
        <div className="text-center">
          <div
            className={`p-6 rounded-lg ${
              result?.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-2 ${
                result?.success ? "text-green-700" : "text-red-700"
              }`}
            >
              {result?.success ? "Успех!" : "Ошибка"}
            </h2>
            <p className="text-gray-700 mb-4">{result?.message}</p>

            {/* {result?.data && (
              <div className="bg-white p-4 rounded border border-gray-200 text-left">
                <h3 className="font-semibold text-gray-800 mb-2">Данные верификации:</h3>
                <p><strong>Возраст:</strong> {result.data.age} лет</p>
                <p><strong>ID пользователя:</strong> {result.data.userId}</p>
                <p><strong>Действует до:</strong> {new Date(result.data.expiresAt).toLocaleString()}</p>
              </div>
            )} */}

            {!result?.success && (
              <button
                onClick={resetScanner}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Отсканировать снова
              </button>
            )}
          </div>
        </div>
      )}

      {/* Примечания о безопасности */}
      {!hasScanned && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Важно:</strong> Для безопасности скриншоты QR-кодов не
            работают. Используйте только <strong>живое сканирование</strong>{" "}
            через камеру.
          </p>
        </div>
      )}
      {hasScanned && (
        <div className="w-full md:w-1/2 lg:w-1/3 flex justify-center items-center mt-10">
          <CustomButton
            text="К покупкам"
            options="w-full"
            onClick={() => router.replace(`/catalog/4?categoryName=Энергетики`)}
          />
        </div>
      )}
    </div>
  );
}
