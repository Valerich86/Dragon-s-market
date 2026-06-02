"use client";

import { useState, useEffect, useRef } from "react";
import { TbArrowsSort } from "react-icons/tb";
import NoInfo from "@/components/UI/no-info";
import ProductCard from "@/components/list-items/product-card";
import { useCatalog } from "@/context/catalog-context";
import { Product } from "@/lib/types";
import { useUserId } from "@/context/userId-context";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  products: Product[];
  categoryName: string;
}

const sortParams = [
  { label: "Новее", value: "created_at" },
  { label: "Дешевле", value: "price" },
  { label: "По алфавиту", value: "name" },
];

export default function ProductsList({ products, categoryName }: Props) {
  const userId = useUserId()!;
  const { cloudPath } = useCatalog();
  const elementRef = useRef<HTMLDivElement>(null);
  const [sortedProducts, setSortedProducts] = useState(products);
  const [sortOpened, setSortOpened] = useState(false);
  const [sortValue, setSortValue] = useState(sortParams[0].value);

  if (!products || products.length === 0) {
    return (
      <NoInfo text={`Продукты в категории "${categoryName}" не найдены`} />
    );
  }

  useEffect(() => {
    const sortProducts = (productsToSort: Product[]) => {
      const sorted = [...productsToSort]; // создаём копию массива, чтобы не мутировать оригинал
      sorted.sort((a, b) => {
        switch (sortValue) {
          case "created_at":
            // сортировка по дате создания (новее — сначала)
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          case "price":
            // сортировка по цене (дешевле — сначала)
            return a.price - b.price;
          case "name":
            // сортировка по алфавиту (A–Z)
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          default: return 0;
        }
      });
      return sorted;
    };
    setSortedProducts(sortProducts(products));
  }, [sortValue, products]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        setSortOpened(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [elementRef]);

  return (
    <>
      <div className={`absolute top-31 left-1/2 -translate-x-1/2`}>
        <button
          className="link active:scale-95"
          onClick={() => setSortOpened((prev) => !prev)}
        >
          <TbArrowsSort size={30} />
        </button>
        <AnimatePresence>
          {sortOpened && (
            <motion.div
              ref={elementRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              aria-label="сортировка товаров"
              className={`rounded-xl absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2 z-50 bg-primary text-secondary
              shadow-[0px_0px_30px_25px_rgba(59,130,246,0.15)] w-50`}
            >
              <select
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
                className="input focus:ring-2 focus:ring-indigo-700 focus:border-transparent cursor-pointer"
              >
                {sortParams.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {sortedProducts.map((item, index) => (
        <ProductCard
          key={item.id}
          item={item}
          cloudPath={cloudPath}
          index={index}
          userId={userId}
        />
      ))}
    </>
  );
}
