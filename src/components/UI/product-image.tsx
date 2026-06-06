"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  productId: number;
  cloudPath: string;
  categoryId: number;
}

export default function ProductImage({ productId, cloudPath, categoryId }: Props) {
  const [src, setSrc] = useState(`${cloudPath}/products/${productId}.png`);

  return (
    <Image
      src={src}
      alt="изображение товара"
      width={1024}
      height={1024}
      loading="lazy"
      className={
        `h-full w-full object-contain rounded-2xl animate-shining select-none 
        pointer-events-none ${categoryId === 4 ? "blur-xs" : ""}`
      }
      onError={() => setSrc("/images/stickers/please_buy.webp")}
    />
  );
}
