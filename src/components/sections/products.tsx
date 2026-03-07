"use client";

import {
  font_accent,
  font_asian1,
  font_asian2,
  font_asian3,
} from "@/lib/fonts";
import { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import { productsSectionHeadline } from "@/lib/text";
import Headline from "../UI/headline";
import type { Product } from "@/lib/types";
import NavLink from "../UI/nav-link";
import ProductImage from "../UI/product-image";

export default function ProductsSection({ cloudPath }: { cloudPath: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const interval = 5000;

  // Функция переключения на следующий слайд
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      if (currentIndex !== products.length - 1) nextSlide();
    },
    onSwipedRight: (eventData) => {
      if (currentIndex !== 0) setCurrentIndex((prevIndex) => prevIndex - 1);
    },
    // onTap: (eventData) => {
    //   handleMouseEnter();
    // },
    // onSwiped: (eventData) => {
    //   handleMouseLeave();
    // },
    delta: 10, // минимальное расстояние для распознавания свайпа
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Запуск автоматического переключения (только после загрузки данных)
  useEffect(() => {
    if (products.length > 0 && intervalRef.current === null) {
      intervalRef.current = setInterval(nextSlide, interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [products]);

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (!intervalRef.current && products.length > 0) {
      intervalRef.current = setInterval(nextSlide, interval);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("/api/products?toCarousel=true");
      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }
      const { data } = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Ошибка:", error);
      setProducts([]); // Гарантируем, что products всегда массив
    } finally {
      setLoading(false);
    }
  };

  const ProductItem = ({
    product,
    index,
  }: {
    product: Product;
    index: number;
  }) => {
    return (
      <div
        className={`bg-primary h-full w-full flex flex-col md:flex-row text-primary`}
      >
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center relative p-5">
          <ProductImage product={product} cloudPath={cloudPath} captionOptions="top-6 left-2 text-2xl"/>
        </div>
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-start justify-around p-10 bg-maskot2 ">
          <h3 className={`text-2xl font-extrabold uppercase`}>
            {product.name}
          </h3>
          <p className="">{product.description}</p>
          <div className="w-full">
            <p className="">
              <span
                className={`${product.status === "sale" ? "line-through decoration-accent text-lg" : "text-2xl font-extrabold"}`}
              >
                {product.price} ₽
              </span>
              {product.status === "sale" && (
                <span className="text-2xl font-extrabold ml-3">
                  {product.old_price} ₽
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <div>Загрузка...</div>;

  // Защита от map для undefined/null
  if (!products || products.length === 0)
    return <div>Нет товаров для отображения</div>;

  return (
    <section aria-label="новинки или акции" className="section x-spacing">
      <Headline text={productsSectionHeadline} />

      <div className="w-full h-[80vh] overflow-x-hidden rounded-2xl relative mt-70 md:mt-100 shadow-xl/20 shadow-secondary dark:shadow-primary ">
        {/* Индикаторы слайдов */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-gray-400/80" : "bg-gray-900/80"
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
        <div {...swipeHandlers} className="h-full">
          <div
            ref={carouselRef}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            style={{
              width: `${products.length * 100}%`,
              transform: `translateX(-${(currentIndex * 100) / products.length}%)`,
            }}
            className="h-full flex transition-transform duration-500"
          >
            {products.map((item, index) => (
              <ProductItem key={item.id} product={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
