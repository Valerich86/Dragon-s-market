"use client";

import type { Product } from "@/lib/types";
import ProductImage from "../UI/product-image";
import { font_accent } from "@/lib/fonts";
import ToCartButton from "../UI/to-cart-button";

interface Props {
  product: Product;
  cloudPath: string;
  userId: number;
}

export default function ProductSection({ product, cloudPath, userId }: Props) {
  return (
    <div className="x-spacing w-full min-h-screen flex flex-col gap-10 lg:flex-row bg-primary justify-center items-center py-20">
      <div
        className={`w-full lg:w-1/2 h-[50vh] lg:h-[80vh] flex items-center justify-center p-3`}
      >
        <div className="h-full bg-primary rounded-md relative shadow-[0px_0px_40px_5px_rgba(59,130,246,0.12)]">
          <ProductImage
            productId={product.id}
            cloudPath={cloudPath}
          />
        </div>
      </div>
      <div className="w-full lg:w-1/2 h-1/2 lg:h-[80vh] lg:p-3 flex flex-col gap-5">
        <p className={`${font_accent.className} font-extrabold uppercase`}>
          {product.name}
        </p>
        {/* <p className={``}>{product.description}</p> */}
        <p>
          {product.weight}
          {product.unit}
        </p>
        <p className="">
          <span
            className={`${product.status === "sale" ? "line-through decoration-accent text-xs" : "font-extrabold"}`}
          >
            Цена: {product.price} ₽
          </span>
          {product.status === "sale" && (
            <span className="font-extrabold ml-3">{product.old_price} ₽</span>
          )}
        </p>
        <div className="w-full lg:w-1/2">
          <ToCartButton
            product_id={product.id}
            category_id={product.category_id}
            customer_id={userId}
            price={product.price}
            startQuantity={product.quantity}
            isInCard
          />
        </div>
      </div>
    </div>
  );
}
