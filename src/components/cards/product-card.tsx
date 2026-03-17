"use client";

import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Category, Product } from "@/lib/types";
import CustomButton from "../UI/custom-button";
import { font_bold } from "@/lib/fonts";

interface Props {
  item: Product;
  currentCategory?: Category;
  cloudPath: string;
}

export default function ProductCard({
  item,
  currentCategory,
  cloudPath,
}: Props) {
  const href = `/catalog/${item.id}?categoryName=${currentCategory?.name}&productName=${item.name}`;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const router = useRouter();

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.9 }}
      animate={inView ? { scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-[47%] lg:w-50 aspect-2/3 text-primary bg-secondary hover:bg-linear-to-r from-secondary to-gray-200 transition-colors duration-500 cursor-pointer rounded-xl"
      onClick={() => router.push(href)}
    >
      <div
        className={`w-full h-full flex flex-col items-center rounded-xl shadow-xl border border-gray-200 relative`}
      >
        <div className="h-1/2 w-full p-3">
          <Image
            src={
              item.image_url
                ? `${cloudPath}/products/${item.image_url}`
                : "/images/stickers/please_buy.webp"
            }
            alt="изображение товара"
            width={200}
            height={200}
            loading="eager"
            className="h-full w-full object-contain rounded-2xl animate-shining"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/stickers/please_buy.webp";
              target.onerror = null;
            }}
          />
        </div>
        <div className="h-1/2 w-full flex flex-col gap-1 lg:gap-2 justify-between p-2 border-t-2 border-gray-300 rounded-b-xl text-xs">
          <div className="w-full flex flex-col gap-1 lg:gap-3">
            <Link href={href} className="text-primary">
            {item.name}
          </Link>
          <p className="text-gray-600">{item.weight} гр</p>
          </div>
          <p className="">
            <span
              className={`${item.status === "sale" ? "line-through decoration-accent text-xs" : font_bold.className}`}
            >
              {item.price} ₽
            </span>
            {item.status === "sale" && (
              <span className={`ml-2 ${font_bold.className}`}>{item.old_price} ₽</span>
            )}
          </p>
          <CustomButton
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {event.stopPropagation(); console.log("Добавлено")}}
            text="В корзину"
            options={"w-full"}
          />
        </div>
      </div>
    </motion.div>
  );
}
