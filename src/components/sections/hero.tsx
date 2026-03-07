"use client";

import { font_accent, font_asian2, font_asian3 } from "@/lib/fonts";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import IntroAnimation from "../animation/intro";
import CustomButton from "../UI/custom-button";
import DarknedImage from "../UI/darkned-image";
import BGBlob from "../UI/bg-blob";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section area-label="hero-секция" className="w-full h-screen flex justify-center items-center x-spacing relative ">
      <DarknedImage src={"/images/bg4.webp"} options="w-screen h-screen bg-right"/>
      <div className="w-full flex flex-col gap-10 items-center md:w-[80%] z-10">
        <p
          className={`${font_accent.className} font-[10px] uppercase text-2xl md:text-4xl leading-normal tracking-wide text-center`}
        >
          Какой азиатский снек перевернёт ваше представление о сладостях?
        </p>
        <CustomButton options="w-2/3 lg:w-1/3" onClick={() => router.push("/catalog")} text={"За покупками"}/>
      </div>
      {/* <div className="absolute w-full lg:w-1/4 top-[55%] lg:top-[35%] left-1/3 lg:left-[65%]">
        <IntroAnimation
          src="/video/hero.webm"
        />
      </div> */}
    </section>
  );
}
