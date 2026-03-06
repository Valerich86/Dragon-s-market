"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  "3arms.webp",
  "candy.webp",
  "evil.webp",
  "heart.webp",
  "in_box.webp",
  "just_fire.webp",
  "my_precious.webp",
  "party.webp",
  "please_buy.webp",
];

export default function Decor() {
  const DecorItem = ({
    imgName,
    position,
    index,
  }: {
    imgName: string;
    position: { x: number; y: number; rotate: number };
    index: number;
  }) => {
    return (
      <motion.div
        animate={{
          opacity: [0, 0.3],
          rotate: [0, 10, 0],
          y: [0, 120, 0],
          x: index % 2 === 0 ? [0, 40, 0] : [0, -40, 0],
        }}
        transition={{
          opacity: {
            duration: 0.5,
            delay: index * 0.5,
            ease: "easeIn",
          },
          rotate: {
            duration: 1.5,
            delay: index * 0.1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
          y: {
            duration: 50,
            delay: index * 0.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          },
          x: {
            duration: 20,
            delay: index * 0.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          },
        }}
        className="absolute fire:opacity-30 opacity-70"
        style={{
          left: `${position.x}vw`,
          top: `${position.y}vh`,
          transform: `rotate(${position.rotate}deg)`,
        }}
      >
        <Image
          src={`/images/stickers/${imgName}`}
          alt="стикер"
          width={50}
          height={50}
          loading="eager"
          className="h-full w-auto object-contain"
        />
      </motion.div>
    );
  };

  const [positions, setPositions] = useState<
    { x: number; y: number; rotate: number }[]
  >([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const totalImages = images.length;

    // Вычисляем размеры сетки
    const cols = Math.ceil(Math.sqrt(totalImages));
    const rows = Math.ceil(totalImages / cols);
    const cellWidth = 100 / cols;
    const cellHeight = 100 / rows;

    // Создаём массив позиций
    const calculatedPositions = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (calculatedPositions.length >= totalImages) break;

        // Случайное смещение внутри ячейки (в процентах от размера ячейки)
        const randomXOffset = Math.random() * 0.8; // 0–80% ширины ячейки
        const randomYOffset = Math.random() * 0.8; // 0–80% высоты ячейки

        calculatedPositions.push({
          // Позиция: начало ячейки + случайное смещение + половина размера изображения (чтобы центрировать относительно точки)
          x: j * cellWidth + randomXOffset * cellWidth,
          y: i * cellHeight + randomYOffset * cellHeight,
          rotate: Math.floor(Math.random() * 61) - 30
        });
      }
    }

    setPositions(calculatedPositions);
    setIsReady(true);
  }, [images.length]);

  // Пока данные не готовы, не рендерим изображения
  if (!isReady) {
    return (
      <div
        className={`fixed top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden`}
      >
        {/* Пустой контейнер во время загрузки */}
      </div>
    );
  }

  return (
    <div
      className={`fixed dark:hidden top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden`}
    >
      {images.map((image, index) => (
        <DecorItem
          key={index}
          index={index}
          imgName={image}
          position={positions[index]}
        />
      ))}
    </div>
  );
}
