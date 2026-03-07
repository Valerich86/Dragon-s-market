"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import type { Category } from "@/lib/types";
import Loading from "@/app/loading";
import NoInfo from "../no-info";
import { font_accent } from "@/lib/fonts";

export default function CategoriesList({ cloudPath }: { cloudPath: string }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
    const backgroundUrl = `${cloudPath}/categories/${item.image_url}`;
    return (
      <motion.div
        ref={ref}
        initial={{  scale: 0.9 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={
          `w-full lg:w-[45%] h-[35vh] relative link rounded-xl shadow-xl bg-center
          bg-cover bg-no-repeat after:absolute after:inset-0 after:bg-black
          after:opacity-70 after:content-empty after:rounded-xl`
        }
        style={{
          backgroundImage: `url(${backgroundUrl})`,
        }}
        onClick={() =>
          router.push(`/catalog/${item.id}?categoryName=${item.name}`)
        }
      >
        <div className="absolute h-full w-full z-10 flex flex-col items-center justify-around text-center p-3 text-primary">
          <h2 className={`${font_accent.className} uppercase`}>{item.name}</h2>
          <p>{item.description}</p>
        </div>
      </motion.div>
    );
  };

  if (loading) return <Loading />;

  if (!categories || categories.length === 0) return <NoInfo />;

  return (
    <div
      aria-label="категории"
      className="w-full flex flex-col lg:flex-row justify-center lg:flex-wrap gap-10 x-spacing"
    >
      {categories.map((item) => (
        <CategoryItem key={item.id} item={item} />
      ))}
    </div>
  );
}
