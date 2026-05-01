"use client";

import { font_light } from "@/lib/fonts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import Link from "next/link";
import Loading from "@/app/loading";
import CustomButton from "@/components/UI/custom-button";
import CatalogUpdater from "@/components/catalog-updater";

interface UpdatingInfo {
  newItems: number | null;
  updated: number | null;
  error: string | undefined;
}

export default function AdminDetailsPage() {
  const [value, setValue] = useState("");
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await fetch(`/api/products?toAdmin=true`);
        const { data } = await response.json();
        setCatalog(data);
      } catch (error) {
        console.error("Ошибка получения данных: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  useEffect(() => {
    const foundItems = catalog.filter(
      (item) =>
        (item.name.toLowerCase().includes(value.toLowerCase()) &&
          value.length >= 3) ||
        item.id.toString() === value,
    );
    setFilteredProducts(foundItems);
  }, [value]);

  if (isLoading) return <Loading />;

  return (
    <div className={`w-full overflow-x-hidden px-5 lg:pr-25 py-10`}>
      <CatalogUpdater />
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Выберите нужный товар
      </h1>
      <div className={`w-full lg:w-1/2 flex flex-col gap-3 items-center z-50`}>
        <input
          className="input"
          value={value}
          autoFocus
          placeholder="Введите название или ID товара"
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
                  href={`/admin/products/details/${item.id}`}
                  className="w-full"
                >
                  <div className="w-full flex items-baseline justify-between">
                    <span className="">ID: {item.id}</span>
                    <span className="text-xs line-clamp-2">{item.name}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
