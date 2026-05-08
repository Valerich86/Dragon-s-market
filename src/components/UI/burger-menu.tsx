"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SlMenu } from "react-icons/sl";
import { PiTelegramLogoLight } from "react-icons/pi";
import ThemeSwitcher from "../theme-switcher";

const links = [
  { name: "Kаталог", href: "/catalog" },
  { name: "Новости", href: "/news" },
  { name: "О доставке", href: "/delivery" },
  { name: "О нас", href: "/about" },
];

// const links_2 = [
//   {name: "Корзина", href: "/basket"},
//   {name: "Профиль", href: "/profile"},
// ];

function BurgerMenu() {
  const [isOpened, setIsOpened] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node) &&
        !iconRef.current?.contains(event.target as Node)
      ) {
        setIsOpened(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [elementRef]);

  const handleSwipe = (direction: number) => {
    // Свайп влево: направление < 0, достаточно большое движение
    if (direction < -50) {
      setIsOpened(false);
    }
  };

  return (
    <>
      <div ref={iconRef} className="h-full flex items-center lg:hidden">
        <button
          className="link"
          onClick={() => setIsOpened(isOpened ? false : true)}
        >
          <SlMenu size={20} className="lg:w-2/3" color="white"/>
        </button>
      </div>
      <AnimatePresence>
        {isOpened && (
          <motion.div
            ref={elementRef}
            initial={{ x: "-100%" }} // Появляется слева
            animate={{ x: 0 }}
            exit={{ x: "-100%" }} // Исчезает влево
            transition={{ duration: 0.1, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
              const swipeDistance = info.offset.x;
              handleSwipe(swipeDistance);
            }}
            aria-label="основная навигация (смартфон)"
            className={` py-5 px-5 h-[80vh] rounded-r-xl absolute left-0 top-15 z-50 bg-primary text-secondary
              shadow-[0px_0px_30px_25px_rgba(59,130,246,0.15)] flex flex-col gap-5`}
          >
            <div className="pb-5 border-b border-gray-400 flex flex-col items-center gap-y-5">
              <strong>г.Пермь, Бульвар Гагарина, 83</strong>
              <a
                href={"https://t.me/dragonbazarmag"}
                target="_blank"
                aria-label="Telegram"
                className="link"
              >
                <PiTelegramLogoLight size={20} />
              </a>
            </div>
            {links.map((link) => (
              <Link
                className="link"
                key={link.href}
                href={link.href}
                onClick={() => setIsOpened(false)}
              >
                {link.name}
              </Link>
            ))}
            {/* <ThemeSwitcher /> */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BurgerMenu;
