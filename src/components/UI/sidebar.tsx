"use client";

import NavLink from "./nav-link";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CustomButton from "./custom-button";

const navLinks = [
  { name: "Фото товара", href: "/admin/products/image-upload" },
  { name: "Карточки товара", href: "/admin/products/details" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [hintIsVisible, setHintIsVisible] = useState(false);

  return (
    <aside
      className={`z-20 lg:h-screen lg:w-1/6 w-full items-center fixed left-0 top-0 flex flex-col bg-primary border-r border-gray-700 pb-5`}
    >
      <Link
        href={"/"}
        className={`h-20`}
        onMouseEnter={() => setHintIsVisible(true)}
        onMouseLeave={() => setHintIsVisible(false)}
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
          <p
            className={`absolute top-1/2 left-1/2 text-xs text-yellow-300
            ${hintIsVisible ? "block" : "hidden"}`}
          >
            Перейти на сайт
          </p>
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
      </div>
    </aside>
  );
}
