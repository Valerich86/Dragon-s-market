"use client";

import { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import Headline from "../UI/headline";
import Slide from "../cards/slide";

interface Props {
  cloudPath: string;
}

const slides = [
  {
    video: "customers.mp4",
    text: `Если ты сейчас не бежишь в "Драконий Базар", то ты что-то делаешь не так!`,
  },
  {
    video: "energy.mp4",
    text: `Ох, этот дракон — мастер пряток: вчера тут был фонарь, сегодня — только улыбка в темноте!`,
  },
  {
    video: "sweets.mp4",
    text: `Приходи на базар на рассвете — а то все чудеса разберут! Вчера были волшебные финики, сегодня — сладкие чипсы, завтра — кто знает?`,
  },
];

export default function VideoCarouselSection({ cloudPath }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Функция переключения на следующий слайд
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (slides.length > 0) nextSlide();
    },
    onSwipedRight: () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
      );
    },
    delta: 10,
  });

  return (
    <section aria-label="новинки или акции" className="section">
      <div className="w-full h-[80vh] overflow-x-hidden relative">
        {/* Индикаторы слайдов */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, index) => (
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
              width: `${slides.length * 100}%`,
              transform: `translateX(-${(currentIndex * 100) / slides.length}%)`,
            }}
            className="h-full flex transition-transform duration-500"
          >
            {slides.map((item, index) => (
              <Slide
                key={index}
                slideItem={item}
                onVideoEnded={nextSlide}
                cloudPath={cloudPath}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
