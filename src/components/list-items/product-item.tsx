'use client';

import { useRef } from "react";
import { useInView, motion } from "framer-motion";
import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductImage from "../UI/product-image";
import CustomButton from "../UI/custom-button";

interface Props {
  item: Product;
  categoryId: string;
  categoryName: string;
  cloudPath: string;
}

export default function ProductItem ({ item, categoryId, categoryName, cloudPath }:Props) {
    const href = `/catalog/${categoryId}/${item.id}?categoryName=${categoryName}&productName=${item.name}`;
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    return (
      <motion.div
        ref={ref}
        initial={{ scale: 0.9 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-[47%] z-10 lg:w-1/5 h-90 link"
      >
        <div
          className={`w-full h-full flex flex-col items-center bg-secondary text-primary rounded-xl shadow-xl border border-gray-200 relative`}
        >
          <div className="h-1/2 w-full">
            <ProductImage product={item} cloudPath={cloudPath} captionOptions="-left-3"/>
          </div>
          <div className="h-1/2 w-full flex flex-col gap-1 justify-between p-2 bg-gray-200 rounded-b-xl">
            <Link href={href} className="text-maskot3">
              {item.name}, {item.weight}г.{" "}
              <span className=""> ⇨</span>
            </Link>
            <p className="">
              <span
                className={`${item.status === "sale" ? "line-through decoration-accent text-xs" : "font-extrabold"}`}
              >
                {item.price} ₽
              </span>
              {item.status === "sale" && (
                <span className="font-extrabold ml-2">{item.old_price} ₽</span>
              )}
            </p>
            <CustomButton
              onClick={() => console.log("Добавлено")}
              text="В корзину"
            />
          </div>
        </div>
      </motion.div>
    );
  };