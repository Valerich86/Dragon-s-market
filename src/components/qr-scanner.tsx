"use client";

import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import { font_light } from "@/lib/fonts";

interface QRScannerJSQRProps {
  onSuccess: (data: string) => void;
  onError: (error: string) => void;
}

export default function QRScannerJSQR({
  onSuccess,
  onError,
}: QRScannerJSQRProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Запуск камеры при монтировании компонента
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsScanning(true);
      } catch (err) {
        onError("Ошибка доступа к камере. Разрешите доступ к камере для сканирования.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onError]);

  // Основной цикл сканирования с оптимизацией
  useEffect(() => {
    if (!stream || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrameId: number;
    let lastScanTime = 0;
    const MIN_SCAN_INTERVAL = 800; // Сканируем каждые 800 мс (1,25 FPS)

    // Фиксированные размеры canvas для стабильности (квадратные)
    const CANVAS_WIDTH = 640;
    const CANVAS_HEIGHT = 640;

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    const scanFrame = (timestamp: number) => {
      // Ограничиваем частоту сканирования
      if (timestamp - lastScanTime < MIN_SCAN_INTERVAL) {
        animationFrameId = requestAnimationFrame(scanFrame);
        return;
      }
      lastScanTime = timestamp;

      // Проверяем, готово ли видео
      if (video.readyState < video.HAVE_CURRENT_DATA) {
        animationFrameId = requestAnimationFrame(scanFrame);
        return;
      }

      try {
        // Рисуем текущий кадр видео на canvas с фиксированным размером
        ctx.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Получаем данные изображения
        const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Декодируем QR‑код
        const code = jsQR(imageData.data, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (code) {
          // Успешное сканирование
          setScanResult(code.data);
          setIsScanning(false);
          onSuccess(code.data);
          return; // Останавливаем сканирование после успеха
        }
      } catch (error) {
        console.error("Ошибка сканирования:", error);
      }

      // Продолжаем сканирование следующего кадра
      animationFrameId = requestAnimationFrame(scanFrame);
    };

    animationFrameId = requestAnimationFrame(scanFrame);

    // Очистка анимации при размонтировании
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stream, onSuccess]);

  return (
    <div className="w-full">
      <h3 className={`${font_light} uppercase text-lg font-semibold mb-2 text-center`}>Подтвердите свой возраст</h3>
      <p className="text-sm text-gray-600 mb-4">
        Используйте цифровой ID в приложении MAX
      </p>

      {/* Квадратный контейнер с фиксированными пропорциями */}
      <div className="w-70 h-70 relative border-2 border-green-500 rounded-lg overflow-hidden mx-auto">
        <div className="relative w-full h-full">
          {/* Видео с object-fit: cover для заполнения квадрата */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Canvas для обработки (скрытый) */}
          <canvas
            ref={canvasRef}
            width={640}
            height={640}
            className="hidden"
          />

          {/* Наложение для помощи пользователю */}
          <div className="absolute top-1/2 left-1/2 -translate-y-[50%] -translate-x-[50%] w-2/3 h-2/3 border-2 border-dashed border-white pointer-events-none" />
          <p className="absolute bottom-2 left-1/2 -translate-x-[50%] text-center text-xs w-50">
            Поместите QR-код в рамку
          </p>
        </div>
      </div>

      {isScanning && (
        <div className="mt-4 text-center flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <span className="ml-2 text-green-600">Сканирование...</span>
        </div>
      )}

      {scanResult && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
          <strong>QR-код распознан:</strong> {scanResult.substring(0, 50)}...
        </div>
      )}
    </div>
  );
}
