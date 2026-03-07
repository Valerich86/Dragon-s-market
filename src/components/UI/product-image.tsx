import { font_asian1 } from "@/lib/fonts";
import Image from "next/image";
import { Product } from "@/lib/types";

interface Props {
  product: Product;
  cloudPath: string;
  captionOptions?: string;
}

export default function ProductImage({ product, cloudPath, captionOptions="" }: Props) {
  return (
    <>
      <span
        className={`${font_asian1.className} ${product.status === "default" ? "hidden" : ""} ${captionOptions} -rotate-30 absolute z-10 bg-maskot3 text-primary py-2 px-3 text-center`}
      >
        {product.status === "new"
          ? "Новинка"
          : product.status === "sale"
            ? "Акция!"
            : ""}
      </span>
      <Image
        src={
          product.image_url
            ? `${cloudPath}/products/${product.image_url}`
            : "/images/stickers/please_buy.webp"
        }
        alt="изображение товара"
        width={200}
        height={200}
        loading="eager"
        className="h-full w-full object-contain rounded-2xl"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/images/stickers/please_buy.webp";
          target.onerror = null;
        }}
      />
    </>
  );
}
