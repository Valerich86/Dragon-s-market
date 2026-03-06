"use client";

import { useState, useRef, useEffect } from "react";
import { SlMagnifier } from "react-icons/sl";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  screenWidth: number;
}

export default function SearchInput({ screenWidth }: Props) {
  const [isOpened, setIsOpened] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);

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
    if (direction > 50) {
      setIsOpened(false);
    }
  };

  return (
    <>
      <button
        ref={iconRef}
        className="px-3 h-full flex items-center"
        onClick={() => setIsOpened(!isOpened)}
      >
        <SlMagnifier
          size={screenWidth > 500 ? 15 : 20}
          className="link text-secondary"
        />
      </button>
      <AnimatePresence>
        {isOpened && (
          <motion.div
            ref={elementRef}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(event, info) => {
              const swipeDistance = info.offset.x;
              handleSwipe(swipeDistance);
            }}
            area-label="поиск"
            className={`x-spacing w-full lg:w-1/2 absolute right-0 top-15`}
          >
            <div className="w-full h-20 bg-primary p-2 rounded-b-xl text-secondary shadow-xl flex gap-5 border border-gray-200"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
