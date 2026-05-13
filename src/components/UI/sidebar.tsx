"use client";

import NavLink from "./nav-link";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CustomButton from "./custom-button";
import SoundEnableButton from "./sound-enabled-button";

const navLinks = [
  { name: "Карточки товара", href: "/admin/products/details" },
  { name: "Фото товара", href: "/admin/products/image-upload" },
  { name: "Заказы", href: "/admin/orders" },
  { name: "Контент", href: "/admin/content" },
  { name: "Политика ОПД", href: "/admin/privacy-policy" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={`z-60 lg:h-screen lg:w-1/6 w-full items-center fixed left-0 top-0 flex flex-col bg-primary border-b lg:border-r border-gray-700 pb-5`}
    >
      <Link
        href={"/"}
        className={`h-20`}
      >
        <div className="relative flex justify-center w-full">
          <Image
            src={`/images/logo-white.webp`}
            alt="logo"
            width={150}
            height={100}
            loading="eager"
            className="h-full w-auto select-none pointer-events-none "
          />
        </div>
      </Link>
      <div className={
        `w-full flex flex-row lg:flex-col flex-wrap lg:flex-nowrap gap-5
        lg:px-7 px-5`
      }>
        {navLinks.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`${pathname.startsWith(item.href) ? "text-accent" : "text-secondary"} 
              text-sm lg:text-lg hover:text-accent transition-colors duration-500`}
          >
            {item.name}
          </Link>
        ))}
      <SoundEnableButton />
      </div>
    </aside>
  );
}
