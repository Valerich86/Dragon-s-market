'use client';

import type { Product } from "@/lib/types";
import Link from "next/link";
import ProductImage from "../UI/product-image";

interface Props {
  product: Product;
  index: number;
  cloudPath: string;
}

export default function CarouselItem ({
    product,
    index,
    cloudPath
  }:Props) {
    const href = `/catalog/${product.category_id}/${product.id}?productName=${product.name}`;
    return (
      <Link href={href}
        className={`bg-secondary h-full w-full flex flex-col md:flex-row text-secondary hover:opacity-95`}
      >
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center relative p-5">
          <ProductImage product={product} cloudPath={cloudPath} captionOptions="top-6 left-2 text-2xl"/>
        </div>
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-start justify-around p-10 bg-maskot2 ">
          <h3 className={`text-xl font-extrabold uppercase`}>
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
      </Link>
    );
  };