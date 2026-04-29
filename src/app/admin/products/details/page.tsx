"use client";

import { font_light } from "@/lib/fonts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import Link from "next/link";
import Loading from "@/app/loading";
import CustomButton from "@/components/UI/custom-button";

interface UpdatingInfo {
  newItems: number | null;
  updatedRemains: number | null;
  error: string | undefined;
}

export default function AdminDetailsPage() {
  const [value, setValue] = useState("");
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sec, setSec] = useState(0);
  const [updatingInfo, setUpdatingInfo] = useState<UpdatingInfo>({
    newItems: null,
    updatedRemains: null,
    error: undefined,
  });

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

  const handleUpdateCatalog = async () => {
    setUpdating(true);
    const interval = setInterval(() => {
      setSec(prev => prev + 1);
    }, 1000);
    setUpdatingInfo({
      newItems: null,
      updatedRemains: null,
      error: undefined,
    });
    const response = await fetch(`/api/admin/products/refresh`);
    if (response.ok) {
      const { updatedRemains, newItems } = await response.json();
      setUpdatingInfo({
        ...updatingInfo,
        updatedRemains: updatedRemains,
        newItems: newItems,
      });
    } else {
      setUpdatingInfo({
        ...updatingInfo,
        error: (await response.json()).error,
      });
    }
    clearInterval(interval);
    setUpdating(false);
  };

  if (isLoading) return <Loading />;

  return (
    <div className={`w-full overflow-x-hidden px-5 lg:pr-25 py-5`}>
      <div className="w-full flex flex-col lg:items-end gap-3 mb-10 lg:mb-0">
        <CustomButton
          text="Обновить каталог"
          options="w-45 h-10"
          isLoading={updating}
          onClick={handleUpdateCatalog}
        />
        {updating && <p className="text-accent text-xs">Идёт обновление каталога ({sec} сек)...</p>}
        {updating && <p className="text-accent text-xs">Не переключайтесь. И не дышите.</p>}
        {updatingInfo.newItems && (
          <p>Загружено новых товаров: {updatingInfo.newItems}</p>
        )}
        {updatingInfo.updatedRemains && (
          <p>Изменено остатков: {updatingInfo.updatedRemains}</p>
        )}
        {updatingInfo.error && (
          <p className="text-accent text-xs">{updatingInfo.error}</p>
        )}
      </div>
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
