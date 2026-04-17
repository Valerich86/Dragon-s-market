"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import Cookies from "js-cookie";

export default function CookieNotification() {
  const [isOpened, setIsOpened] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  
  const handleSetCookies = () => {
    setIsOpened(false);
    Cookies.set("dragon_bazar_cookiesDate", new Date().toISOString(), {expires: 24*120});
  };

  useEffect(() => {
    const cookiesDate = Cookies.get("dragon_bazar_cookiesDate");
    if (!cookiesDate) setIsOpened(true);
    else return;
    function handleClickOutside(event: MouseEvent): void {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        handleSetCookies();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [elementRef]);


  return (
    <AnimatePresence>
      {isOpened && (
        <motion.div
          ref={elementRef}
          initial={{ y: "-200%" }}
          animate={{ y: 0 }}
          exit={{ y: "-200%" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`absolute left-0 top-20 z-50 w-full text-gray-500
              shadow-[0px_0px_30px_25px_rgba(59,130,246,0.15) x-spacing`}
        >
          <div className="w-full flex justify-end link">
            <IoClose size={20} onClick={handleSetCookies} />
          </div>
          <div className="w-full text-xs bg-primary p-5 rounded-xl">
            <p>
              Данный сайт может использовать технические cookie для обеспечения
              корректной работы.
            </p>
            <p>
              Подробности в{" "}
              <Link
                href={"/privacy-policy"}
                className="text-indigo-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Политике конфиденциальности
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
