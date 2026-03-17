"use client";

import { useEffect, useState } from "react";
import { font_light } from "@/lib/fonts";
import { Category, Product } from "@/lib/types";
import Loading from "../loading";
import NoInfo from "@/components/no-info";
import ProductItem from "@/components/cards/product-card";
import ProductsSection from "@/components/sections/products";

export default function CatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [cloudPath, setCloudPath] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [porductsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/categories`);
        const { data, cloudPath } = await response.json();
        setCloudPath(cloudPath);
        setCategories(data);
        setCurrentCategory(data[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const response = await fetch(
          // `/api/products?categoryId=${currentCategory?.id}`,
          `/api/products?categoryId=51baf9d7-06c1-4816-ab5d-5a18adcd7799`,
        );
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

  if (!categories || !currentCategory || categories.length === 0) return <NoInfo />;

  return (
    <main area-label="каталог" className={`w-full overflow-x-hidden x-spacing`}>
      <section aria-label="категории" className="w-full flex flex-wrap gap-5">
        <h1 className={`${font_light.className} uppercase`}>Каталог</h1>
        <div className="w-full flex flex-wrap gap-5 text-xs lg:text-sm justify-between">
          {categories.map((item) => (
            <div
              key={item.id}
              className={`link ${currentCategory === item ? "bg-accent" : ""} rounded p-1`}
              onClick={() => {setCurrentCategory(item);
                console.log(currentCategory.name)
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      </section>
      <ProductsSection products={products} isLoading={porductsLoading} cloudPath={cloudPath} currentCategory={currentCategory}/>
    </main>
  );
}
