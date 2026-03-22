"use client";

import { useState, useEffect } from "react";
import NoInfo from "@/components/no-info";
import ProductCard from "@/components/cards/product-card";
import { useCatalog } from "@/context/catalog-context";
import { Product, Category } from "@/lib/types";
import Loading from "@/app/loading";

export default function ProductsList({ category }: { category: Category }) {
  const { products, cloudPath } = useCatalog();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshPosition, setRefreshPosition] = useState(false);
  const [maskotPosition, setMaskotPosition] = useState(0);
  const [maskotKey, setMaskotKey] = useState(0); // Ключ для перезапуска анимации

  useEffect(() => {
    // const randomIndex = Math.floor(Math.random() * 4);
    const randomIndex = Math.floor(Math.random() * filteredProducts.length);
    setMaskotPosition(randomIndex);
    setMaskotKey(prev => prev + 1);
  }, [filteredProducts.length, refreshPosition]);

  useEffect(() => {
    if (!products) {
      setIsLoading(true);
      return;
    }

    let list: Product[] = [];

    try {
      if (category.id === 0) {
        list = [...products].sort(() => Math.random() - 0.5);
      } else {
        list = products.filter((product) =>
          Number(product.category_id) === Number(category.id)
        );
      }
      setFilteredProducts(list);
    } catch (error) {
      console.error("Ошибка фильтрации товаров:", error);
      setFilteredProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [category, products]); 

  if (isLoading) return <Loading />;

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <NoInfo
        text={`Продукты в категории "${category.name}" не найдены`}
      />
    );
  }

  return (
    <>
      {filteredProducts.map((item, index) => (
        <ProductCard
          key={item.id}
          item={item}
          currentCategory={category}
          cloudPath={cloudPath}
          index={index}
          maskotPosition={maskotPosition}
          changeMaskotPosition={() => setRefreshPosition(!refreshPosition)}
          maskotKey={maskotKey}
        />
      ))}
    </>
  );
}
