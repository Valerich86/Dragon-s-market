'use client';

import { useEffect, useRef, useState } from 'react';


interface Props {
  src: string;
  options?: string;
  loop?: boolean;
}

export default function MaskotAnimation({
  src,
  options = '',
  loop = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Инициализируем Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: '50px 0px', // Наблюдаем за элементами в 50px от вьюпорта
        threshold: 0.1 // Срабатывает, когда 10% элемента видно
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Эффект для управления воспроизведением при изменении видимости
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      // Перезапускаем видео с начала при появлении во вьюпорте
      video.currentTime = 0;
      video.play().catch((e) => {
        console.log('Автовоспроизведение заблокировано:', e);
      });
    } else {
      // Ставим на паузу и сбрасываем позицию при уходе из вьюпорта
      video.pause();
      video.currentTime = 0;
    }
  }, [isVisible]);

  return (
    <div className={`md:w-1/3 ${isVisible ? "animate-shining" : ""}`}>
      <video
        onContextMenu={(e) => e.preventDefault()}
        ref={videoRef}
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          userSelect: 'none',
        }}
        loop={loop}
        controls={false}
      >
        <source src={src} type="video/webm" />
        Ваш браузер не поддерживает видео.
      </video>
    </div>
  );
}
