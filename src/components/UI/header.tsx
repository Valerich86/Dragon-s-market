"use client";

import NavLink from "./nav-link";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SlBasket } from "react-icons/sl";
import { SlUser } from "react-icons/sl";
import { SlMagnifier } from "react-icons/sl";
import BurgerMenu from "./burger-menu";
import NavIcon from "./nav-icon";

const centeredLinks = [
  { name: "Kаталог", href: "/catalog" },
  { name: "Категории", href: "/categories" },
  { name: "Доставка", href: "/delivery" },
];

const rightLinks = [
  { icon: SlMagnifier, href: "/catalog" },
  { icon: SlBasket, href: "/basket" },
  { icon: SlUser, href: "/profile" },
];

export default function Header() {
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
      className={
        `w-full absolute h-15 left-0 top-0 flex justify-between items-center z-50
        border-b border-gray-200 bg-primary x-spacing`
      }
    >
      {/* левые ссылки */}
      <div className="flex justify-start items-center gap-5 w-1/2 md:w-1/3">
        <BurgerMenu links={centeredLinks}/>
        <Link href={"/"} className="link">
          <Image
            src={
              screenWidth > 500
                ? `/images/logo-desktop.webp`
                : `/images/logo-mobile.webp`
            }
            alt="logo"
            width={150}
            height={100}
            loading="eager"
            className="w-full select-none pointer-events-none "
          />
        </Link>
      </div>

      {/* центральные ссылки */}
      <div className="hidden md:flex justify-center items-center w-1/3 h-full">
        {centeredLinks.map((item, index) => (
          <NavLink href={item.href} name={item.name} key={index} />
        ))}
      </div>

      {/* правые ссылки */}
      <div className="flex justify-end items-center w-1/2 md:w-1/3 h-full">
        {rightLinks.map((item, index) => {
          return (
            <NavIcon key={index} href={item.href} icon={item.icon}/>
          );
        })}
      </div>
    </div>
  );
}
