"use client";

import { useState, useEffect } from "react";
import { font_bold } from "@/lib/fonts";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { MdOutlineRefresh } from "react-icons/md";
import { useParams } from "next/navigation";
import type { Order, OrderItem } from "@/lib/types";
import Loading from "@/app/loading";
import NoInfo from "@/components/UI/no-info";
import PaintCaption from "@/components/UI/paint-caption";
import ProductImage from "@/components/UI/product-image";

export default function Orders() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [cloudPath, setCloudPath] = useState("");
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/orders/${id}`);
        const { order, items } = await response.json();
        setOrder(order);
        setItems(items);
        const cpResponse = await fetch(`/api/cloud`);
        const { cloudPath } = await cpResponse.json();
        setCloudPath(cloudPath);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [refresh]);

  if (isLoading) return <Loading />;
  if (!order || items.length === 0) {
    return <NoInfo text={`Данные по заказу №${id} не найдены`} />;
  }

  return (
    <section
      aria-label="заказ"
      className="w-full flex flex-col justify-center gap-10"
    >
      <div
        className={`${font_bold.className} w-full flex items-center gap-5 text-xl`}
      >
        <strong>Заказ № {id}</strong>
        <MdOutlineRefresh
          className={`cursor-pointer`}
          onClick={() => setRefresh((prev) => !prev)}
        />
      </div>
      <div className="flex items-baseline gap-5 w-full lg:w-1/3">
        <p className="">Текущий статус:</p>
        <div className="relative -translate-y-5 lg:-translate-y-6">
          <PaintCaption caption={order.status} />
        </div>
      </div>
      <div className="flex items-baseline gap-5 w-full lg:w-1/3">
        <p>Тип заказа:</p>
        <div className="relative -translate-y-5 lg:-translate-y-6">
          <PaintCaption caption={order.type} />
        </div>
      </div>
      <div className="flex items-baseline gap-5 w-full lg:w-1/3">
        <p>Создан:</p>
        <div className="relative -translate-y-5 lg:-translate-y-6">
          <PaintCaption
            caption={new Date(order.created_at)
              .toLocaleString()
              .substring(0, 17)}
          />
        </div>
      </div>
      {order.type === "доставка" && (
        <div className="flex items-baseline gap-5 w-full lg:w-1/3">
          <p>Ожидается:</p>
          <div className="relative -translate-y-5 lg:-translate-y-6">
            <PaintCaption
              caption={new Date(order.expected_arrival_time)
                .toLocaleString()
                .substring(0, 17)}
            />
          </div>
        </div>
      )}

      {items.map((item) => (
        <div
          key={item.id}
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
                <div className="flex items-center">
                  <IoClose />
                  <span>{item.quantity}</span>
                </div>
                <span>{item.total_price}₽</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-baseline gap-5 w-full lg:w-1/3">
        <p>Товары, сумма:</p>
        <div className="relative -translate-y-5 lg:-translate-y-6">
          <PaintCaption caption={order.items_sum} />
        </div>
      </div>

      <div className="flex items-baseline gap-5 w-full lg:w-1/3">
        <p>Сборка:</p>
        <div className="relative -translate-y-5 lg:-translate-y-6">
          <PaintCaption caption={order.assembly_cost} />
        </div>
      </div>

      {order.type === "доставка" && (
        <div className="flex items-baseline gap-5 w-full lg:w-1/3">
          <p>Доставка:</p>
          <div className="relative -translate-y-5 lg:-translate-y-6">
            <PaintCaption caption={order.delivery_cost} />
          </div>
        </div>
      )}

      <div className="w-full flex justify-end items-center pt-5 border-t border-accent text-xl">
        <p className={font_bold.className}>Итого: {order.total_sum}₽</p>
      </div>

      {order.type === "доставка" && (
        <div>
          <label className="mb-3 label">Заказ будет доставлен по адресу:</label>
          <div className="bg-gray-600 p-5 rounded-lg mt-3">
            <p>Город {order.city}</p>
            <p>
              ул.{order.street}, дом {order.house}, подъезд {order.entrance}
            </p>
            <p>
              этаж {order.floor}, кв.{order.apartment}, домофон{" "}
              {order.intercom_number}
            </p>
            <p>
              {order.additional_info
                ? `Доп.информация: ${order.additional_info}`
                : ""}
            </p>
          </div>
        </div>
      )}

      {order.additional_info && (
        <p>
          <strong>Примечание: </strong>
          {order.additional_info}
        </p>
      )}
    </section>
  );
}
