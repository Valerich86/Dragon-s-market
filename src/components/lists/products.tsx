"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import Loading from "@/app/loading";
import CustomButton from "../UI/custom-button";

export default function ProductsList({
  categoryId = "",
  categoryName = "",
}: {
  categoryId?: string;
  categoryName?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // await new Promise(resolve => setTimeout(resolve, 10000));
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }
      const { data } = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  const ProductItem = ({ item }: { item: Product }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[47%] z-10 lg:w-1/5 h-90"
      >
        <Link
          href={`/catalog/${categoryId}/${item.id}?categoryName=${categoryName}&productName=${item.title}`}
          className={`w-full h-full link flex flex-col items-center bg-primary text-secondary rounded-xl shadow-xl border border-gray-200`}
        >
          <div className="w-full h-1/2 flex justify-center items-center p-2">
            <Image
              src={item.url}
              alt="изображение товара"
              width={200}
              height={200}
              loading="lazy"
              className="h-full w-auto object-cover"
            />
          </div>
          <div className="h-1/2 w-full flex flex-col gap-2 justify-between p-2 bg-gray-200 rounded-b-xl">
            <p className="">
              {item.title}, {item.weight}г.
            </p>
            <p className="">
              <span
                className={`${item.status === "sale" ? "line-through decoration-accent text-xs" : "font-extrabold"}`}
              >
                {item.price} ₽
              </span>
              {item.status === "sale" && (
                <span className="font-extrabold ml-3">{item.old_price} ₽</span>
              )}
            </p>
            <CustomButton
              onClick={() => console.log("Добавлено")}
              text="В корзину"
            />
          </div>
        </Link>
      </motion.div>
    );
  };

  if (loading) return <Loading />;

  if (!products || products.length === 0)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Нет товаров
      </div>
    );

  return (
    <div
      aria-label="категории"
      className="w-full flex flex-wrap gap-y-5 md:gap-y-10 gap-x-2 items-center justify-between x-spacing"
    >
      {products.map((item) => (
        <ProductItem key={item.id} item={item} />
      ))}
    </div>
  );
}
