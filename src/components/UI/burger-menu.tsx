"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

  const handleSwipe = (direction: number) => {
    // Свайп влево: направление < 0, достаточно большое движение
    if (direction < -50) {
      setIsOpened(false);
    }
  };

  return (
    <>
      <button
        className="block md:hidden link"
        onClick={() => setIsOpened(isOpened ? false: true)}
      >
        <Image
          src={"/icons/menu.svg"}
          alt="menu"
          width={40}
          height={40}
          loading="eager"
          className="h-1/2"
        />
      </button>
      <AnimatePresence>
      {isOpened && (
        <motion.div
        ref={elementRef}
        initial={{ x: '-100%' }} // Появляется слева
          animate={{ x: 0 }}
          exit={{ x: '-100%'}} // Исчезает влево
          transition={{ duration: 0.1, ease: 'easeOut' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(event, info) => {
            const swipeDistance = info.offset.x;
            handleSwipe(swipeDistance);
          }}
          className={
            `w-2/3 py-10 pl-10 rounded-r-xl absolute left-0 top-15 bg-primary shadow-2xl
            flex flex-col gap-5`
          }
        >
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpened(false)}>
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}

export default BurgerMenu;
