"use client";

import { font_accent, font_asian2, font_asian3 } from "@/lib/fonts";
import Image from "next/image";
import { useState, useEffect } from "react";
import MaskotAnimation from "../animation/maskot";
import ThemeSwitcher from "../theme-switcher";

export default function HeroSection() {
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Устанавливаем начальное значение
    handleResize();

    // Подписываемся на событие resize
    window.addEventListener("resize", handleResize);

    // Очистка при размонтировании
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-screen flex justify-start items-center relative">
      <div className="hidden theme-3:block absolute h-screen w-screen bg-[url('/images/bg4.webp')] -left-[5vw] md:-left-[10vw] bg-cover bg-no-repeat">
        <div className="absolute inset-0 bg-black opacity-65 md:opacity-85"></div>
      </div>
      <div className="w-full flex flex-col gap-10 md:w-2/3 items-center md:items-start z-10">
        <p
          className={`${font_accent.className} font-[10px] uppercase text-2xl md:text-4xl leading-normal tracking-wide text-center md:text-left`}
        >
          Какой азиатский снек перевернёт ваше представление о сладостях?
        </p>
        <ThemeSwitcher />
      </div>
      <div className="absolute animate-support-md w-full lg:w-1/4 top-[55%] lg:top-[45%] left-1/3 lg:left-[75%]">
        <MaskotAnimation
          src="/video/intro.webm"
          className="hover:cursor-pointer"
        />
      </div>
    </div>
  );
}
