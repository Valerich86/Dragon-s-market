"use client";

import { Product } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import ProductImage from "./product-image";

interface Props {
  product: Product;
  cloudPath: string;
}

export default function DayProduct({ product, cloudPath }: Props) {
  const href = `/catalog/${product.id}?productName=${product.name}`;
  return (
    <Link href={href} className="w-full lg:w-auto flex justify-center">
      <div className="w-1/2 lg:w-full relative">
        <ProductImage product={product} cloudPath={cloudPath} />
        <div className={`bg-[url("/images/paint.webp")] h-full w-full bg-size-[80%] bg-no-repeat absolute left-1/2 top-[70%] flex justify-center pt-1 pr-10 lg:pr-20 text-xl lg:text-2xl`}>
          Товар дня
        </div>
      </div>
    </Link>
  );
}
