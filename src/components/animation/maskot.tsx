"use client";

import { useEffect, useRef, useState } from "react";


interface Props {
  src: string;
  tempSrc?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  loop?: boolean;
}

export default function MaskotAnimation({
  src,
  tempSrc = "/video/swearing.webm",
  className = "",
  width = "100%",
  height = "auto",
  loop = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [current, setCurrent] = useState(src);
  const [isFirstPlay, setIsFirstPlay] = useState(true);

  // Обработчик окончания видео
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (current !== src) {
        // Возвращаемся к основному видео после временного
        setCurrent(src);
      } else {
        // Для основного видео — зацикливаем последние 70% (но не при первом проигрывании)
        if (!isFirstPlay && video.duration) {
          const offset = video.duration * 0.7;
          const startPosition = video.duration - offset;
          video.currentTime = startPosition;
        }
        video.play().catch(e =>
          console.log('Автовоспроизведение заблокировано:', e)
        );
      }
    };

    video.addEventListener("ended", handleEnded);
    setIsFirstPlay(false);
    return () => video.removeEventListener("ended", handleEnded);
  }, [current, isFirstPlay]);

  // Эффект для перезагрузки видео при смене current
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Перезагружаем видео с новым src
    video.load();

    // Ждём загрузки метаданных перед установкой позиции
    const onLoadedMetadata = () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);

      if (current === src && !isFirstPlay && video.duration) {
        // Устанавливаем позицию на 70% только для основного видео (не при первом запуске)
        const offset = video.duration * 0.7;
        const startPosition = video.duration - offset;
        video.currentTime = startPosition;
      }

      // Запускаем воспроизведение
      video.play().catch(e =>
        console.log('Автовоспроизведение заблокировано при загрузке:', e)
      );
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', onLoadedMetadata);
  }, [current]);


  const clickHandler = () => {
    // Меняем на временное видео
    setCurrent(tempSrc);
    // После клика сбрасываем флаг первого воспроизведения — следующее воспроизведение основного видео будет с 70%
    setIsFirstPlay(false);
  };

  return (
    <div className={className} onClick={clickHandler} style={{ cursor: "pointer" }}>
      <video
        onContextMenu={(e) => e.preventDefault()}
        ref={videoRef}
        autoPlay
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        style={{
          width,
          height,
          display: "block",
          maxWidth: "100%",
          userSelect: "none",
          cursor: "default",
        }}
        loop={current === src ? loop : false} // Временное видео не зацикливаем
        controls={false}
      >
        <source src={current} type="video/webm" />
        {/* Резервный формат */}
        <source src={src.replace(".webm", ".mov")} type="video/quicktime" />
        Ваш браузер не поддерживает видео.
      </video>
    </div>
  );
}
