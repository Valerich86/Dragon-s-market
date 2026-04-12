"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  productId: number;
  cloudPath: string;
  captionOptions?: string;
}

export default function ProductImage({
  productId,
  cloudPath,
  captionOptions = "",
}: Props) {
  const [src, setSrc] = useState(`${cloudPath}/products/${productId}.png`);

  return (
    <>
      <Image
        src={src}
        alt="изображение товара"
        width={200}
        height={200}
        loading="lazy"
        className="h-full w-full object-cover rounded-2xl animate-shining select-none pointer-events-none"
        onError={() => setSrc('/images/stickers/please_buy.webp')}
      />
    </>
  );
}
