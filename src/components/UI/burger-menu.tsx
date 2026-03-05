"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SlMenu } from "react-icons/sl";
import { PiTelegramLogoLight } from "react-icons/pi";
import ThemeSwitcher from "../theme-switcher";

type NavLink = {
  href: string;
  name: string;
};

interface Props {
  links: NavLink[];
}

function BurgerMenu({ links }: Props) {
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
      <div ref={iconRef} className="h-full flex items-center">
        <button
          className="link select-none"
          onClick={() => setIsOpened(isOpened ? false : true)}
        >
          <SlMenu size={20} className="lg:w-2/3" color="black"/>
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
            area-label="основная навигация (смартфон)"
            className={` py-5 px-5 rounded-r-xl absolute left-0 top-15 bg-primary text-secondary shadow-xl
            flex flex-col gap-5 border border-gray-200`}
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
            <ThemeSwitcher />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default BurgerMenu;
