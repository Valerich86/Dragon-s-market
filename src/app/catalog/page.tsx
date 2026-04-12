'use client';

import ProductsList from "@/components/sections/products-list";
import { useCatalog } from "@/context/catalog-context";

export default function AllProducts() {
  const {allProducts} = useCatalog();

  return (
    <main
      aria-label="все товары"
      className="w-full flex flex-wrap gap-5 items-center justify-start py-15"
    >
      <ProductsList products={allProducts} categoryName="Все товары"/>
    </main>
  );
}
