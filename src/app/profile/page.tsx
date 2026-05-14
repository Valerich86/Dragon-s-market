"use client";

import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import CustomButton from "@/components/UI/custom-button";
import PaintCaption from "@/components/UI/paint-caption";
import { useProfile } from "@/context/profile-context";
import Notification from "@/components/UI/notification";

export default function General() {
  const { general } = useProfile();
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeleteProfile = async () => {
    setIsLoading(true);
    setShowWarning(false);
    try {
      const response = await fetch(`/api/auth/delete/${general.id}`, {
        method: "DELETE",
      });
      Cookies.remove("dragon_bazar_cookiesDate");
      router.replace("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="w-full md:w-1/2 lg:w-1/3">
        <CustomButton
          text={"Удалить учётную запись"}
          options="w-full"
          onClick={() => setShowWarning(true)}
          isLoading={isLoading}
        />
      </div>
      <Notification
        text="Удаляя свою учётную запись, Вы отзываете согласие на использование персональных данных, но не сможете использовать некоторые функции сайта. Согласны?"
        show={showWarning}
        withAcception
        mood="evil"
        onAccept={handleDeleteProfile}
        onAbort={() => setShowWarning(false)}
      />
    </section>
  );
}
