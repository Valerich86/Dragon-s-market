"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Props {src: string; options?: string;}

export default function HeroBackground({ src, options = "" }: Props) {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {setShowAnimation(false)}, 23000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${options} absolute inset-0 after:absolute 
        after:inset-0 after:bg-linear-to-b w-screen h-screen overflow-hidden
        after:from-transparent after:to-primary after:to-70%`}
    >
      <Image
        src={src}
        alt="изображение - фон для страницы"
        width={1980}
        height={1024}
        loading="eager"
        quality={75}
        className={
          `animate-fadeOut h-full w-full object-top-right lg:object-top-left 
          object-cover select-none pointer-events-none`
        }
      />
      {showAnimation && (
        <div
          className={
            `absolute h-[60vh] md:h-[80vh] bottom-0 lg:-bottom-25 
            animate-hero -right-[40%] sm:right-0 lg:right-10`
          }
        >
          <video
            onContextMenu={(e) => e.preventDefault()}
            autoPlay
            preload="auto"
            muted
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            loop={true}
            controls={false}
            className={`h-full w-auto object-contain pointer-events-none select-none rounded-xl`}
          >
            <source src={"/video/hero.webm"} type="video/webm"/>Not supported</video>
        </div>
      )}
    </div>
  );
}
