"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import Image from "next/image";
import Loading from "@/app/loading";
import CustomButton from "../UI/custom-button";
import { font_accent, font_asian1 } from "@/lib/fonts";

export default function ProductItem({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // await new Promise(resolve => setTimeout(resolve, 10000));
    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }
      const { data } = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!product)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Товар не найден
      </div>
    );

  return (
    <div className="x-spacing w-full flex flex-col gap-y-5 lg:flex-row">
      <div className="w-full lg:w-1/3 relative flex justify-center">
        <span
          className={`${font_asian1.className} text-3xl -rotate-30 absolute top-8 left-3 bg-maskot3 text-primary py-2 w-30 text-center`}
        >
          {product.status === "new"
            ? "Новинка"
            : product.status === "sale"
              ? "Акция!"
              : ""}
        </span>
        <Image
          src={product.url}
          alt="изображение товара"
          width={200}
          height={200}
          loading="eager"
          className="h-full w-auto object-cover"
        />
      </div>
      <div className="w-full lg:w-2/3 lg:p-10">
        <div className="w-full flex flex-col gap-5 ">
          <p className={`${font_accent.className} font-extrabold uppercase`}>
            {product.title}, {product.weight}г.
          </p>
          <p className={``}>{product.description}</p>
          <p className="">
            <span
              className={`${product.status === "sale" ? "line-through decoration-accent text-xs" : "font-extrabold"}`}
            >
              Цена: {product.price} ₽
            </span>
            {product.status === "sale" && (
              <span className="font-extrabold ml-3">{product.old_price} ₽</span>
            )}
          </p>
          <CustomButton
            onClick={() => console.log("Добавлено")}
            text="В корзину"
          />
        </div>
      </div>
    </div>
  );
}
