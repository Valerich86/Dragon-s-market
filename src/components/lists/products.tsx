"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import Loading from "@/app/loading";
import CustomButton from "../UI/custom-button";
import NoInfo from "../no-info";
import { font_asian1 } from "@/lib/fonts";
import ProductImage from "../UI/product-image";

export default function ProductsList({
  categoryId = "",
  categoryName = "",
  cloudPath,
}: {
  categoryId?: string;
  categoryName?: string;
  cloudPath: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // await new Promise(resolve => setTimeout(resolve, 10000));
    try {
      const response = await fetch(`/api/products?categoryId=${categoryId}`);
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
    const href = `/catalog/${categoryId}/${item.id}?categoryName=${categoryName}&productName=${item.name}`;
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    return (
      <motion.div
        ref={ref}
        initial={{ scale: 0.9 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[47%] z-10 lg:w-1/5 h-90 link"
      >
        <div
          className={`w-full h-full flex flex-col items-center bg-primary text-secondary rounded-xl shadow-xl border border-gray-200 relative`}
        >
          <div className="h-1/2 w-full">
            <ProductImage product={item} cloudPath={cloudPath} captionOptions="-left-3"/>
          </div>
          <div className="h-1/2 w-full flex flex-col gap-2 justify-between p-2 bg-gray-200 rounded-b-xl">
            <Link href={href} className="text-maskot3 font-bold">
              {item.name}, {item.weight}г.{" "}
              <span className=""> ⇨</span>
            </Link>
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
        </div>
      </motion.div>
    );
  };

  if (loading) return <Loading />;

  if (!products || products.length === 0) return <NoInfo />;

  return (
    <div
      aria-label="категории"
      className="w-full flex flex-wrap gap-y-5 md:gap-y-10 md:gap-x-10 items-center justify-between md:justify-start x-spacing"
    >
      {products.map((item) => (
        <ProductItem key={item.id} item={item} />
      ))}
    </div>
  );
}
