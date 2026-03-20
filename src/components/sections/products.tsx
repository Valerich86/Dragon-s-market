// "use client";

import type { Product, Category } from "@/lib/types";
import Loading from "../../app/loading";
import NoInfo from "../no-info";
import ProductCard from "../cards/product-card";

export default function ProductsSection({
  products,
  cloudPath,
  isLoading,
  currentCategory,
}: {
  products: Product[];
  cloudPath: string;
  isLoading: boolean;
  currentCategory: Category;
}) {

  if (isLoading) return (
    <div className="h-[50vh] w-full"></div>
  );

  if (!products || products.length === 0)
    return (
      <NoInfo
        text={`Продукты в категории ${currentCategory.name} не найдены`}
      />
    );

  return (
    <section
      aria-label="товары"
      className="w-full flex flex-wrap gap-4 items-center justify-between py-15"
    >
      {products.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          currentCategory={currentCategory}
          cloudPath={cloudPath}
        />
      ))}
    </section>
  );
}
