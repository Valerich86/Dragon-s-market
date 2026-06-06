"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductImage from "../UI/product-image";
import { CartItem, Delivery } from "@/lib/types";
import { font_bold, font_light } from "@/lib/fonts";
import ToCartButton from "../UI/to-cart-button";
import Loading from "@/app/loading";
import ClearCart from "../UI/clear-cart";
import OrderForm from "../forms/order";

interface Props {
  cloudPath: string;
  userId: number;
}

export default function CartOrderData({ cloudPath, userId }: Props) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [itemsIds, setItemsIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [hasCategory4, setHasCategory4] = useState(false);
  const [isOrderTime, setIsOrderTime] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const utcOffset = 5;
      const localTime = new Date(now.getTime() + utcOffset * 60 * 60 * 1000);
      const hours = localTime.getUTCHours();
      setIsOrderTime(hours >= 10 && hours < 22);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Проверка каждую минуту
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userId === 0) return;
    setHasCategory4(false);
    const fetchCart = async () => {
      try {
        const response = await fetch(`/api/cart?customer_id=${userId}`);
        const {cart} = await response.json();
        setCartItems(cart);
        let addToItemsIds = [];
        for (let c of cart) {
          addToItemsIds.push(c.id);
          if (c.product_category === 4) setHasCategory4(true);
        }
        setItemsIds(addToItemsIds);
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
    <div className="w-full flex flex-col gap-5 relative">
      <ClearCart userId={userId} refresh={refresh} setRefresh={setRefresh} />
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
              <div className="w-full">
                <div className="w-full flex items-center justify-between">
                  <Link
                    href={`/product/${item.product_id}?productName=${item.product_name}`}
                    className="flex gap-2 items-center text-xs line-clamp-2 w-1/2 md:w-2/3"
                  >
                    {/* о товаре */}
                    <div className="w-20 h-20">
                      <ProductImage
                        productId={item.product_id}
                        categoryId={item.product_category}
                        cloudPath={cloudPath}
                      />
                    </div>
                    <span className="hidden md:block max-w-[70%]">
                      {item.product_name}
                    </span>
                    <div className="flex">
                      <span className="">{item.product_weight}</span>
                      <span className="">{item.product_unit}</span>
                    </div>
                    <span className="">{item.product_price}₽</span>
                  </Link>

                  {/* итого */}
                  <div className="flex justify-between w-1/2 md:w-1/3">
                    <div className="w-1/2">
                      <ToCartButton
                        product_id={item.product_id}
                        customer_id={item.customer_id}
                        price={item.product_price}
                        remains={item.product_remains}
                        startQuantity={item.quantity}
                        order_minimum={item.product_minimum}
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
      <div className="w-full flex justify-end items-center pt-5 border-t border-accent text-xl">
        <p className={font_bold.className}>{cartItems[0].cart_total}₽</p>
      </div>
      <h1 className={`${font_light.className} uppercase my-10`}>
        Информация для заказа
      </h1>
      {!isOrderTime && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded text-center text-sm lg:text-base">
          Оформление заказов доступно с 10:00 до 22:00 по пермскому времени
        </div>
      )}
      {isOrderTime && (
        <OrderForm
          userId={userId}
          cartItems={itemsIds}
          totalItems={itemsIds.length}
          itemsSum={cartItems[0].cart_total}
          hasCategory4={hasCategory4}
        />
      )}
    </div>
  );
}
