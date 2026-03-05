"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type { Category } from "@/lib/types";
import Loading from "@/app/loading";
import BackButton from "../UI/back-button";

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // await new Promise(resolve => setTimeout(resolve, 10000));
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }
      const { data } = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  const CategoryItem = ({ item }: { item: Category }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    return (
      <motion.div
      ref={ref}
        initial={{opacity: 0, scale: 0.99}}
         animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className=" w-[45%] z-10 lg:w-1/6 h-50"
      >
        <Link
        href={`/catalog/${item.id}?categoryName=${item.name}`}
        className={`link h-full w-full flex flex-col items-center bg-primary text-secondary rounded-xl shadow-xl border border-gray-200`}
      >
        <div className="w-full h-2/3 flex justify-center items-center p-2">
          <Image
            src={item.url}
            alt="изображение категории"
            width={200}
            height={200}
            loading="lazy"
            className="h-full w-auto object-cover"
          />
        </div>
        <div className="h-1/3 w-full flex justify-center p-2">
          <p className="text-center">{item.name}</p>
        </div>
      </Link>
      </motion.div>
    );
  };

  if (loading) return <Loading />;

  if (!categories || categories.length === 0)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Нет новостей для отображения
      </div>
    );

  return (
    <div
      aria-label="категории"
      className="w-full flex flex-wrap gap-5 lg:gap-10 items-center justify-center x-spacing"
    >
      {categories.map((item) => (
        <CategoryItem key={item.id} item={item} />
      ))}
    </div>
  );
}
