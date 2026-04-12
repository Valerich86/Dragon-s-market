"use client";

import { Product } from "@/lib/types";
import Link from "next/link";
import ProductImage from "./product-image";
import PaintCaption from "./paint-caption";
import SparklesAnimation from "../animation/sparkles";

interface Props {
  product: Product;
  cloudPath: string;
}

export default function DayProduct({ product, cloudPath }: Props) {
  const href = `/product/${product.id}?productName=${product.name}`;
  return (
    <Link href={href} className="w-full lg:w-auto flex justify-center">
      <div className="w-1/2 lg:w-full relative">
        <div className="w-50 h-50 lg:w-80 lg:h-80">
          <ProductImage productId={product.id} cloudPath={cloudPath} />
        </div>
        <PaintCaption caption="Товар дня" options="lg:text-xl left-1/3 lg:left-1/2"/>
        <SparklesAnimation/>
      </div>
    </Link>
  );
}
