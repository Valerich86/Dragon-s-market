"use client";

import NavLink from "./nav-link";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { SlBasket } from "react-icons/sl";
import { SlUser } from "react-icons/sl";
import BurgerMenu from "./burger-menu";
import NavIcon from "./nav-icon";
import SearchInput from "./search-input";

const centeredLinks = [
  { name: "Kаталог", href: "/catalog" },
  { name: "Новости", href: "/news" },
  { name: "Как купить?", href: "/delivery" },
  { name: "О нас", href: "/about" },
];

const rightLinks = [
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
    <header
      className={`w-full fixed left-0 top-0 flex justify-between items-center z-50 bg-primary px-3 lg:pl-0`}
    >
      {/* левые ссылки */}
      <div className="flex justify-start items-center h-13 lg:gap-5 w-full lg:w-1/3">
        <BurgerMenu />
        <Image
          src={"/images/hieroglyphs.webp"}
          alt="logo"
          width={150}
          height={150}
          loading="eager"
          className="h-1/2 lg:h-full w-auto select-none pointer-events-none hidden lg:block"
        />
        <Link href={"/"} className="h-[90%] lg:h-[110%]">
          <Image
            src={
              screenWidth > 500
                ? `/images/logo-white.webp`
                : `/images/logo-white.webp`
            }
            alt="logo"
            width={150}
            height={100}
            loading="eager"
            className="h-full w-auto select-none pointer-events-none "
          />
        </Link>
      </div>

      {/* центральные ссылки */}
      <nav
        area-label="основная навигация (десктоп)"
        className="hidden lg:flex justify-center items-center w-1/2 h-full"
      >
        {centeredLinks.map((item, index) => (
          <NavLink href={item.href} name={item.name} key={index} />
        ))}
      </nav>

      {/* правые ссылки */}
      <div className="flex justify-end items-center w-1/2 lg:w-1/3 h-full">
        <SearchInput screenWidth={screenWidth} />
        {rightLinks.map((item, index) => {
          return <NavIcon key={index} href={item.href} icon={item.icon} />;
        })}
      </div>
    </header>
  );
}
