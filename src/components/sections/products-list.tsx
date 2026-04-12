"use client";

import { useState, useEffect } from "react";
import NoInfo from "@/components/no-info";
import ProductCard from "@/components/cards/product-card";
import { useCatalog } from "@/context/catalog-context";
import { Product, Category } from "@/lib/types";
import { useUserId } from "@/context/userId-context";

interface Props {
  products: Product[];
  categoryName: string;
}

export default function ProductsList({ products, categoryName }:Props) {
  const userId = useUserId();
  const {cloudPath} = useCatalog();
  const [refreshPosition, setRefreshPosition] = useState(false);
  const [maskotPosition, setMaskotPosition] = useState(0);
  const [maskotKey, setMaskotKey] = useState(0); // Ключ для перезапуска анимации

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * products.length);
    setMaskotPosition(randomIndex);
    setMaskotKey(prev => prev + 1);
  }, [products.length, refreshPosition]);

  if (!products || products.length === 0) {
    return (
      <NoInfo
        text={`Продукты в категории "${categoryName}" не найдены`}
      />
    );
  }

  return (
    <>
      {products.map((item, index) => (
        <ProductCard
          key={item.id}
          item={item}
          cloudPath={cloudPath}
          index={index}
          maskotPosition={maskotPosition}
          changeMaskotPosition={() => setRefreshPosition(!refreshPosition)}
          maskotKey={maskotKey}
          userId={userId}
        />
      ))}
    </>
  );
}
