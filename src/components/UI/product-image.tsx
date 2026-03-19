"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";

interface Props {
  product: Product;
  cloudPath: string;
  captionOptions?: string;
}

export default function ProductImage({
  product,
  cloudPath,
  captionOptions = "",
}: Props) {
  const [src, setSrc] = useState(`${cloudPath}/products/${product.id}.webp`);

  return (
    <>
      {/* <span
        className={`${font_asian1.className} ${product.status === "default" ? "hidden" : ""} ${captionOptions} -rotate-30 absolute z-10 bg-maskot3 text-secondary py-2 px-3 text-center`}
      >
        {product.status === "new"
          ? "Новинка"
          : product.status === "sale"
            ? "Акция!"
            : ""}
      </span> */}
      <Image
        src={src}
        alt="изображение товара"
        width={200}
        height={200}
        loading="lazy"
        className="h-full w-full object-contain rounded-2xl animate-shining"
        onError={() => setSrc('/images/stickers/please_buy.webp')}
      />
    </>
  );
}
