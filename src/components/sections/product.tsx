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
        <div className="h-full bg-primary rounded-xl relative shadow-[0px_0px_40px_5px_rgba(59,130,246,0.15)]">
          <ProductImage
            productId={product.id}
            cloudPath={cloudPath}
          />
          <p className="text-[7px] absolute bottom-2 left-1/2 -translate-x-[50%] text-center w-[150%]">Внешний вид товара может отличаться от представленного на фото.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 lg:p-3 flex flex-col gap-5">
        <p className={`${font_accent.className} font-extrabold uppercase`}>
          {product.name}
        </p>
        <pre className={`text-xs`}><strong>Состав:</strong> {product.composition}</pre>
        <pre className={`text-xs`}>{product.description}</pre>
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
        </p>
        <div className="w-full lg:w-1/2">
          <ToCartButton
            product_id={product.id}
            customer_id={userId}
            price={product.price}
            startQuantity={product.quantity}
            isInCart
          />
        </div>
      </div>
    </div>
  );
}
