"use client";

import { useRef, useState, useEffect } from "react";
import { useInView, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Category, Product } from "@/lib/types";
import CustomButton from "../UI/custom-button";
import { font_bold } from "@/lib/fonts";
import MaskotAnimation from "../animation/maskot";

interface Props {
  item: Product;
  currentCategory?: Category;
  cloudPath: string;
  index: number;
  maskotPosition: number;
  changeMaskotPosition: () => void;
  maskotKey: number;
}

export default function ProductCard({
  item,
  currentCategory,
  cloudPath,
  index,
  maskotPosition,
  changeMaskotPosition,
  maskotKey,
}: Props) {
  const href = `/product/${item.id}?categoryName=${currentCategory?.name}&productName=${item.name}`;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const router = useRouter();
  const [src, setSrc] = useState(`${cloudPath}/products/${item.id}.png`);

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.9 }}
      animate={inView ? { scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-[47%] lg:w-50 aspect-2/3 text-primary bg-secondary
         hover:bg-linear-to-r from-secondary to-gray-200 transition-colors 
         duration-500 cursor-pointer rounded-xl relative ${index === maskotPosition ? "animate-swing": ""}`}
      onClick={() => router.push(href)}
    >
      <div
        className={`w-full h-full flex flex-col items-center rounded-xl shadow-xl border border-gray-200 relative`}
      >
        <div className="h-1/2 w-full">
          <Image
            src={src}
            alt=""
            width={200}
            height={200}
            loading="lazy"
            className="h-full w-full object-cover rounded-2xl animate-shining"
            onError={() => setSrc("/images/stickers/please_buy.webp")}
          />
        </div>
        <div className="h-1/2 w-full flex flex-col lg:gap-2 justify-between p-1 lg:p-2 border-t-2 border-gray-300 rounded-b-xl text-xs">
          <p className="text-primary line-clamp-3 lg:text-sm lg:min-h-15">
            {item.name}
          </p>
          <p className="text-gray-600 hidden lg:block">
            {item.weight}
            {item.unit}
          </p>
          <div className="w-full flex flex-col lg:flex-row gap-1">
            <div className="flex justify-between items-baseline w-full">
              <p className="text-gray-600 lg:hidden">
                {item.weight}
                {item.unit}
              </p>
              <p
                className={`${font_bold.className} ${item.price.toString().length > 6 ? "tracking-tighter" : ""} text-lg`}
              >
                {item.price}₽
              </p>
            </div>
            <CustomButton
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                console.log("Добавлено");
              }}
              text="В корзину"
              options={"w-full"}
            />
          </div>
        </div>
      </div>

      {index === maskotPosition && (
        <MaskotAnimation
          key={maskotKey} // При смене key компонент перемонтируется
          onComplete={changeMaskotPosition}
        />
      )}
    </motion.div>
  );
}
