"use client";

import { useState, useEffect, useRef } from "react"; 
import { useSwipeable } from "react-swipeable";
import Headline from "../UI/headline";
import type { Product } from "@/lib/types";
import CarouselItem from "../cards/carousel-item";

interface Props {
  cloudPath: string;
  // products: Product[];
}

export default function CarouselSection({ cloudPath }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null); 
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const interval = 5000;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/products?toCarousel=true`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }
      const { data } = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Функция переключения на следующий слайд
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (products.length > 0) nextSlide();
    },
    onSwipedRight: () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? products.length - 1 : prevIndex - 1
      );
    },
    delta: 10,
  });

  // Запуск и перезапуск автоматического переключения
  useEffect(() => {
    // Очищаем предыдущий интервал, если он существует
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Запускаем новый интервал, только если есть продукты
    if (products.length > 0) {
      intervalRef.current = setInterval(nextSlide, interval);
    }

    // Очистка интервала при размонтировании компонента
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [products.length, interval]); // Зависимости: длина массива продуктов и интервал

  // const handleMouseEnter = () => {
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //     intervalRef.current = null;
  //   }
  // };

  // const handleMouseLeave = () => {
  //   if (!intervalRef.current && products.length > 0) {
  //     intervalRef.current = setInterval(nextSlide, interval);
  //   }
  // };

  if (isLoading) return <div className="w-screen h-screen"></div>;

  if (!products || products.length === 0) return null;

  return (
    <section aria-label="новинки или акции" className="section x-spacing">

      <div
        className="w-full h-[80vh] overflow-x-hidden rounded-2xl relative shadow-xl/20 shadow-secondary"
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
      >
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
            style={{
              width: `${products.length * 100}%`,
              transform: `translateX(-${(currentIndex * 100) / products.length}%)`,
            }}
            className="h-full flex transition-transform duration-500"
          >
            {products.map((item, index) => (
              <CarouselItem
                key={item.id}
                product={item}
                index={index}
                cloudPath={cloudPath}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
