"use client";

import PaintCaption from "@/components/UI/paint-caption";
import { useProfile } from "@/context/profile-context";
import { font_bold, font_light, font_mg } from "@/lib/fonts";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

export default function General() {
  const { general } = useProfile();

  return (
    <section
      aria-label="Общая информация"
      className="w-full flex flex-col gap-10"
    >
      <div className="flex items-baseline gap-5 w-full">
        <p>Вы зарегистрированы</p>
        <div className="relative -translate-y-5 lg:-translate-y-6">
          <PaintCaption
            caption={new Date(general.created_at).toLocaleDateString()}
          />
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div className="w-20 h-20">
          <Image
            src={"/images/icons/mascot-icon.png"}
            alt="Иконка Дракона"
            width={200}
            height={200}
            className="w-full h-auto"
          />
        </div>
        <IoClose />
        {general.bonus_amount}
      </div>
    </section>
  );
}
