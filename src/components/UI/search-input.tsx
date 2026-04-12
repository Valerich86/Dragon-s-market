"use client";

import { useState, useRef, useEffect } from "react";
import { SlMagnifier } from "react-icons/sl";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";
import Link from "next/link";
import ProductImage from "./product-image";
import { font_bold } from "@/lib/fonts";

export default function SearchInput({
  allProducts,
  cloudPath,
}: {
  allProducts: Product[];
  cloudPath: string;
}) {
  const [isOpened, setIsOpened] = useState(false);
  const elementRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node) &&
        !iconRef.current?.contains(event.target as Node)
      ) {
        setValue("");
        setFilteredProducts([]);
        setIsOpened(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [elementRef]);

  useEffect(() => {
    if (value.length < 3) return;
    const foundItems = allProducts.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredProducts(foundItems);
  }, [value]);

  return (
    <>
      {!isOpened && (
        <button
          className="px-3 h-full flex items-center"
          onClick={() => setIsOpened(!isOpened)}
        >
          <SlMagnifier size={30} className="link text-secondary" />
        </button>
      )}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            aria-label="поиск"
            className={`w-full h-screen fixed bg-primary/90 flex flex-col gap-3 items-center left-1/2 -translate-x-[50%] top-0 z-50 py-[10vh] px-[5vw] md:px-[30vw]`}
          >
            <input
              ref={elementRef}
              className="input"
              value={value}
              autoFocus
              placeholder="Введите название товара"
              onChange={(e) => setValue(e.target.value)}
            />
            <div className="w-full flex flex-col gap-5 overflow-y-scroll [scrollbar-width:none]">
              {value.length >= 3 &&
                filteredProducts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.1,
                      ease: "easeOut",
                      delay: index / 10,
                    }}
                    className="w-full border-b border-gray-900"
                  >
                    <Link
                      href={`/product/${item.id}?productName=${item.name}`}
                      className="w-full"
                    >
                      <div className="w-full flex items-baseline justify-between gap-10">
                        <div className="flex gap-2 items-baseline-last">
                          <div className="w-10 h-10">
                            <ProductImage
                              productId={item.id}
                              cloudPath={cloudPath}
                            />
                          </div>
                          <span className="text-xs line-clamp-2">{item.name}</span>
                        </div>
                        <span className={`${font_bold.className}`}>{item.price}₽</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
