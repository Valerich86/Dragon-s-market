'use client';

import type { Product } from "@/lib/types";
import ProductImage from "../UI/product-image";
import CustomButton from "../UI/custom-button";
import { font_accent } from "@/lib/fonts";

interface Props {
  product: Product;
  cloudPath: string;
}

export default function ProductSection ({product, cloudPath}:Props) {
  return (
    <div className="x-spacing w-full flex flex-col gap-10 lg:flex-row justify-center items-center">
        <div
          className={`w-full lg:w-1/3 h-[50vh] relative flex items-center justify-center bg-primary p-3 rounded-2xl`}
        >
          <ProductImage
            product={product}
            cloudPath={cloudPath}
            captionOptions="left-0 top-5 text-2xl"
          />
        </div>
        <div className="w-full lg:w-1/3 lg:p-10">
          <div className="w-full flex flex-col gap-5 ">
            <p className={`${font_accent.className} font-extrabold uppercase`}>
              {product.name}, {product.weight}г.
            </p>
            <p className={``}>{product.description}</p>
            <p className="">
              <span
                className={`${product.status === "sale" ? "line-through decoration-accent text-xs" : "font-extrabold"}`}
              >
                Цена: {product.price} ₽
              </span>
              {product.status === "sale" && (
                <span className="font-extrabold ml-3">
                  {product.old_price} ₽
                </span>
              )}
            </p>
            <CustomButton
              onClick={() => console.log("Добавлено")}
              text="В корзину"
              options="w-full md:w-1/2"
            />
          </div>
        </div>
      </div>
  );
}