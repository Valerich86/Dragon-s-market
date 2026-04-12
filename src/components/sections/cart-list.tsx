"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductImage from "../UI/product-image";
import { CartItem } from "@/lib/types";
import { font_bold } from "@/lib/fonts";
import ToCartButton from "../UI/to-cart-button";
import Loading from "@/app/loading";

interface Props {
  cloudPath: string;
  userId: number;
}

export default function CartList({ cloudPath, userId }: Props) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (userId === 0) return;
    const fetchCart = async () => {
      try {
        const response = await fetch(`/api/cart?customer_id=${userId}`);
        const { cart } = await response.json();
        setCartItems(cart);
      } catch (error) {
        console.error("Ошибка получения корзины: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, [refresh]);

  if (isLoading) return <Loading />;

  if (cartItems.length === 0 && !isLoading) {
    return <div className="w-full text-center mt-10">Корзина пуста</div>;
  }

  return (
    <div className="w-full flex flex-col gap-5">
      {cartItems.map(
        (item, index) =>
          item.quantity !== 0 && (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
                delay: index / 10,
              }}
              className="w-full border-b border-gray-900 text-secondary"
            >
              <div
                className="w-full"
              >
                <div className="w-full flex items-center justify-between">
                  <Link href={`/product/${item.product_id}?productName=${item.product_name}`} className="w-full">
                  {/* о товаре */}
                    <div className="flex gap-2 items-center text-xs line-clamp-2 w-1/2 md:w-2/3">
                      <div className="w-20 h-20">
                        <ProductImage
                          productId={item.product_id}
                          cloudPath={cloudPath}
                        />
                      </div>
                      <span className="hidden md:block w-[60%]">
                        {item.product_name}
                      </span>
                      <div className="flex">
                        <span className="">{item.product_weight}</span>
                        <span className="">{item.product_unit}</span>
                      </div>
                      <span className="">{item.product_price}₽</span>
                    </div>
                  </Link>

                  {/* итого */}
                  <div className="flex justify-between w-1/2 md:w-1/3">
                    <div className="w-1/2">
                      <ToCartButton
                        product_id={item.product_id}
                        customer_id={item.customer_id}
                        price={item.product_price}
                        startQuantity={item.quantity}
                        setRefresh={setRefresh}
                        refresh={refresh}
                      />
                    </div>
                    <span>{item.total_price}₽</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ),
      )}
      <div className="w-full flex justify-end pt-5 border-t border-accent">
        <p className={`${font_bold.className}`}>{cartItems[0].cart_total}₽</p>
      </div>
    </div>
  );
}
