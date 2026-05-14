"use client";

import { Product } from "@/lib/types";
import Link from "next/link";
import ProductImage from "./product-image";
import PaintCaption from "./paint-caption";
import SparklesAnimation from "../animation/sparkles";
import { motion } from "framer-motion";

interface Props {
  product: Product;
  cloudPath: string;
}

export default function DayProduct({ product, cloudPath }: Props) {
  const href = `/product/${product.id}?productName=${product.name}`;
  return (
    <motion.div
      initial={{ scale: 0, rotate: 3240 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
      className="w-full flex justify-center"
    >
      <Link href={href}>
        <div className="w-1/2 lg:w-full relative">
          <div className="w-25 h-25 lg:w-40 lg:h-40">
            <ProductImage productId={product.id} cloudPath={cloudPath} />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 1 }}
            className="w-full absolute inset-0"
          >
            <PaintCaption caption="Товар дня" />
            <SparklesAnimation />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
