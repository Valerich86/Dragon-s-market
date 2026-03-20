"use client";

import { useEffect, useState } from "react";
import { font_light } from "@/lib/fonts";
import { Category, Product } from "@/lib/types";
import Loading from "../loading";
import NoInfo from "@/components/no-info";
import ProductsSection from "@/components/sections/products";
import SearchInput from "@/components/UI/search-input";

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [cloudPath, setCloudPath] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [porductsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/categories`);
        const { data, cloudPath } = await response.json();
        const allCategory = {id: 0, name: "Все"};
        setCloudPath(cloudPath);
        setCategories([allCategory, ...data]);
        setCurrentCategory(allCategory);
        const response2 = await fetch(`/api/products`);
        const result = await response2.json();
        setAllProducts(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const api = currentCategory?.id === 0 ? `/api/products?random=true` : `/api/products?categoryId=${currentCategory?.id}`
      setProductsLoading(true);
      try {
        const response = await fetch(api);
        const { data } = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory]);

  if (isLoading) return <Loading />;

  if (!categories || !currentCategory || categories.length === 0)
    return <NoInfo />;

  return (
    <main area-label="каталог" className={`w-full overflow-x-hidden x-spacing`}>
      <section aria-label="категории" className="w-full flex flex-wrap gap-5">
        <div className="w-full flex justify-between items-center h-10">
          <h1 className={`${font_light.className} uppercase`}>Каталог</h1>
          <SearchInput allProducts={allProducts} cloudPath={cloudPath}/>
        </div>
        <div className="w-full flex flex-wrap gap-5 text-xs lg:text-sm justify-between">
          {categories.map((item) => (
            <div
              key={item.id}
              className={`link ${currentCategory === item ? "bg-accent" : ""} rounded p-1`}
              onClick={() => {
                setCurrentCategory(item);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </section>
      <ProductsSection
        products={products}
        isLoading={porductsLoading}
        cloudPath={cloudPath}
        currentCategory={currentCategory}
      />
    </main>
  );
}
