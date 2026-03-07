"use client";

import { useState, useEffect } from "react";
import type { Product } from "@/lib/types";
import Image from "next/image";
import Loading from "@/app/loading";
import CustomButton from "../UI/custom-button";
import { font_accent, font_asian1 } from "@/lib/fonts";
import ProductImage from "../UI/product-image";

export default function ProductItem({
  id,
  cloudPath,
}: {
  id: string;
  cloudPath: string;
}) {
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
    <div className="x-spacing w-full flex flex-col gap-10 lg:flex-row justify-center items-center">
      <div
        className={`w-full lg:w-1/3 h-[50vh] relative flex items-center justify-center bg-primary p-3 rounded-2xl`}
      >
        <ProductImage
          product={product}
          cloudPath={cloudPath}
          captionOptions="left-0 top-5 text-2xl"
        />
      </div>
      <div className="w-full lg:w-1/3 lg:p-10">
        <div className="w-full flex flex-col gap-5 ">
          <p className={`${font_accent.className} font-extrabold uppercase`}>
            {product.name}, {product.weight}г.
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
            options="w-full md:w-1/2"
          />
        </div>
      </div>
    </div>
  );
}
