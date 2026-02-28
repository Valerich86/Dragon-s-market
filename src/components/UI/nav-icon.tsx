"use client";

import { font_decor } from "@/lib/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { useState, useEffect } from "react";

interface NavLinkProps {
  href: string;
  icon: IconType;
}

export default function NavIcon({ href, icon }: NavLinkProps) {
  const pathName = usePathname();
  const Icon = icon;
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
    <div
      className={`${pathName === href ? "bg-accent text-primary" : "bg-none text-secondary"} px-3 h-full flex items-center`}
    >
      <Link href={href} className="link">
        <Icon size={screenWidth > 500 ? 15 : 20} />
      </Link>
    </div>
  );
}
