"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { font_bold } from "@/lib/fonts";

interface Props {
  src?: string;
  onComplete: () => void; // Опциональный колбэк для уведомления родителя
}

export default function MaskotAnimation({
  src = "/video/maskot.webm",
  onComplete,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasBeenClicked, setHasBeenClicked] = useState(false); // Флаг, что клик уже был
  const [animationClass, setAnimationClass] = useState("animate-shining");

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Запускаем видео при монтировании
      video.play().catch((error) => {
        console.warn("Автовоспроизведение видео заблокировано:", error);
      });

      // Обработчик для отслеживания прогресса видео
      const handleTimeUpdate = () => {
        const currentTime = video.currentTime;
        const duration = video.duration;

        if (!hasBeenClicked && duration > 0 && currentTime / duration >= 0.5) {
          setAnimationClass("animate-hide");
          setTimeout(() => {
            onComplete(); // Гарантированно вызываем колбэк после анимации
          }, 1000);
        }
      };

      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [onComplete, hasBeenClicked]); // Добавляем hasBeenClicked в зависимости

  // Обработчик клика по контейнеру
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (hasBeenClicked) return; // Предотвращаем множественные клики
    setAnimationClass("animate-gotcha");
    setHasBeenClicked(true);
    const video = videoRef.current;

    if (video) {
      const duration = video.duration;
      if (duration > 0) {
        video.currentTime = duration * 0.9;
        video.play().catch((error) => {
          console.warn("Ошибка воспроизведения после клика:", error);
        });
      }
    }
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div
      onClick={(e) => handleClick(e)}
      className={`${animationClass}
      absolute bottom-0 -left-14 md:-left-19 w-1/2 z-10 -rotate-15`}
    >
      <video
        onContextMenu={(e) => e.preventDefault()}
        ref={videoRef}
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        style={{
          width: "100%",
          height: "auto",
          userSelect: "none",
        }}
        loop={false}
        controls={false}
      >
        <source src={src} type="video/webm" />
        Ваш браузер не поддерживает видео.
      </video>
      {hasBeenClicked && (
        <motion.div
          initial={{opacity: 1, y: 0}}
          animate={{opacity: 0, y: "-400%"}}
          transition={{duration: 3}}
          className={
            `${font_bold} text-accent text-shadow-lg text-shadow-amber-50 text-5xl absolute left-1/2 -translate-y-[50%] top-0 w-full`
          }
        >
          + 1
        </motion.div>
      )}
    </div>
  );
}
