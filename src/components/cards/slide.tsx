"use client";

import { font_heading, font_mg } from "@/lib/fonts";
import { useEffect, useRef, useState } from "react";

interface Props {
  onVideoEnded: () => void;
  slideItem: {
    video: string;
    text: string;
  }
}

export default function Slide({onVideoEnded, slideItem}:Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Инициализируем Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        entry.isIntersecting ? video.play() : video.load();
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

  return (
    <div
      className={`w-full h-full pointer-events-none select-none overflow-hidden flex justify-center relative`}
    >
      <video
        onContextMenu={(e) => e.preventDefault()}
        ref={videoRef}
        onEnded={onVideoEnded}
        // autoPlay
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        loop={false} 
        controls={false}
        className={
          `absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none`
        }
      >
        <source src={`/video/${slideItem.video}`} type="video/webm" />
        Ваш браузер не поддерживает видео.
      </video>
      <div className="absolute inset-0 bg-linear-to-b from-primary via-transparent to-primary z-10 x-spacing">
          <h2 className={`${font_mg.className} animate-tremor text-xl lg:text-4xl lg:w-3/4 leading-loose`}>{slideItem.text}</h2>
      </div>
    </div>
  );
}
