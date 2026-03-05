"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  options?: string;
  loop?: boolean;
}

export default function IntroAnimation({
  src,
  options = "",
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
        rootMargin: '50px 0px', // Наблюдаем за элементами, которые находятся в 50px от вьюпорта
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
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const cutVideo = () => {
      if (video.duration) {
        const offset = video.duration * 0.65;
        const startPosition = video.duration - offset;
        video.currentTime = startPosition;
        video.play();
      }
    };
    cutVideo();
    const handleEnded = () => {
      cutVideo();
    };

    video.addEventListener("ended", handleEnded);
    video
      .play()
      .catch((e) =>
        console.log("Автовоспроизведение заблокировано при загрузке:", e),
      );
    return () => video.removeEventListener("ended", handleEnded);
  }, [src, isVisible]);

  const clickHandler = () => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video
      .play()
      .catch((e) =>
        console.log("Автовоспроизведение заблокировано при загрузке:", e),
      );
  };

  return (
    <div
      className={`animate-shining-intro cursor-pointer`}
      onClick={clickHandler}
    >
      <video
        onContextMenu={(e) => e.preventDefault()}
        ref={videoRef}
        // autoPlay
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          userSelect: "none",
          // opacity: isVisible ? 1 : 0,
          // transition: "opacity 0.5s ease"
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
