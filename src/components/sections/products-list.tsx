"use client";

import { useState, useEffect } from "react";
import NoInfo from "@/components/UI/no-info";
import ProductCard from "@/components/cards/product-card";
import { useCatalog } from "@/context/catalog-context";
import { Product, Category } from "@/lib/types";
import { useUserId } from "@/context/userId-context";

interface Props {
  products: Product[];
  categoryName: string;
}

export default function ProductsList({ products, categoryName }:Props) {
  const userId = useUserId()!;
  const {cloudPath} = useCatalog();

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
          userId={userId}
        />
      ))}
    </>
  );
}
