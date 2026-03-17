"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import Loading from "../../app/loading";
import CustomButton from "../UI/custom-button";
import NoInfo from "../no-info";
import ProductItem from "../list-items/product-item";
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

  if (loading) return <Loading />;

  if (!products || products.length === 0) return <NoInfo />;

  return (
    <div
      aria-label="категории"
      className="w-full flex flex-wrap gap-y-5 md:gap-y-10 md:gap-x-10 items-center justify-between md:justify-start x-spacing"
    >
      {products.map((item) => (
        <ProductItem key={item.id} item={item} categoryId={categoryId} categoryName={categoryName} cloudPath={cloudPath}/>
      ))}
    </div>
  );
}
