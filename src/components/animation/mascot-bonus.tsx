"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src?: string;
  onComplete: () => void;
  index: number;
  stopSwing: () => void;
}

export default function MascotBonusAnimation({
  src = "/video/mascot.webm",
  onComplete,
  index,
  stopSwing,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mascotSide, setMascotSide] = useState(index % 2 === 0 ? "right" : "left");
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const [animationClass, setAnimationClass] = useState("animate-shining");
  const [mascotRotation, setMascotRotation] = useState(
    mascotSide === "left"
      ? "-rotate-12"
      : mascotSide === "right"
        ? "rotate-12"
        : "",
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Запускаем видео при монтировании
    video.play().catch((error) => {console.error(error)});
    // Интервал проверки прогресса видео (каждые 100 мс)
    const intervalId = setInterval(() => {
      // Выходим, если клик уже был — отключаем цикличность
      if (hasBeenClicked) return;
      const duration = video.duration;
      if (duration > 0) {
        const stopTime = duration * 0.8;
        if (video.currentTime >= stopTime) {
          video.currentTime = 0;
          video.play(); // Запускаем заново
        }
      }
    }, 100); // Проверка каждые 100 мс — баланс точности и нагрузки
    return () => {
      clearInterval(intervalId); // Очистка интервала при размонтировании компонента
    };
  }, [hasBeenClicked]);

  // Обработчик клика по контейнеру
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (hasBeenClicked) return; // Предотвращаем множественные клики
    setHasBeenClicked(true);
    setAnimationClass("animate-gotcha");
    stopSwing();
    setMascotRotation("default");
    const video = videoRef.current;
    if (video) {
      const duration = video.duration;
      if (duration > 0) {
        video.currentTime = duration * 0.9;
        video.play().catch((error) => {console.error(error)});
      }
      setInterval(() => {
        video.currentTime = duration * 0.9;
        video.play().catch((error) => {console.error(error)});
      }, 1200);
    }
    setTimeout(() => {
      onComplete();
    }, 5000);
  };

  return (
    <div
      onClick={(e) => handleClick(e)}
      className={`${animationClass} ${
        mascotSide === "left" ? "-left-17 md:-left-19.5" : "left-35 md:left-45"
      } ${mascotRotation}
        absolute bottom-0 w-1/2 z-20`}
    >
      <video
        onContextMenu={(e) => e.preventDefault()}
        ref={videoRef}
        muted
        playsInline
        autoPlay
        disablePictureInPicture
        disableRemotePlayback
        style={{
          width: "100%",
          height: "auto",
          userSelect: "none",
          transform: mascotSide === "right" ? "scaleX(-1)" : "scaleX(1)",
        }}
        loop={false}
        controls={false}
      >
        <source src={src} type="video/webm" />
        Ваш браузер не поддерживает видео.
      </video>
    </div>
  );
}
