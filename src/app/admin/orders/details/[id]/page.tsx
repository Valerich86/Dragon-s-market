"use client";

import { useState, useEffect, SubmitEvent } from "react";
import { font_bold } from "@/lib/fonts";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Order, OrderItem, orderStatuses } from "@/lib/types";
import Loading from "@/app/loading";
import NoInfo from "@/components/no-info";
import ProductImage from "@/components/UI/product-image";
import CustomButton from "@/components/UI/custom-button";

export default function Orders() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [cloudPath, setCloudPath] = useState("");
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [currentStatus, setCurrentStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setIsFetching(true);
      try {
        const response = await fetch(`/api/orders/${id}`);
        const { order, items } = await response.json();
        setOrder(order);
        setItems(items);
        setCurrentStatus(order.status)
        const cpResponse = await fetch(`/api/cloud`);
        const { cloudPath } = await cpResponse.json();
        setCloudPath(cloudPath);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchOrder();
  }, []);

  const handleUpdateStatus = async () => {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({status: currentStatus}),
      });
      console.log(currentStatus)
    } catch (error) {
      console.error(error);
    } 
  };

  useEffect(() => {
    handleUpdateStatus();
  }, [currentStatus]);

  if (isFetching) return <Loading />;
  if (!order || items.length === 0) {
    return <NoInfo text={`Данные по заказу №${id} не найдены`} />;
  }

  return (
    <main
      aria-label="Детали заказа (админ)"
      className="w-full md:w-[90%] flex flex-col justify-center gap-5 text-sm p-5"
    >
      <div
        className={`${font_bold.className} w-full flex items-center justify-between text-xl`}
      >
        <strong>Заказ № {id}</strong>
      </div>
      <form className="w-full flex flex-col lg:flex-row lg:justify-between gap-5 z-60" onSubmit={handleUpdateStatus}>
        <p className="">Текущий статус:</p>
        <select
          value={currentStatus}
          onChange={(e) => setCurrentStatus(e.target.value)}
          className="input focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {orderStatuses.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </form>
      <p className="">
        Тип заказа: <strong>{order.type}</strong>
      </p>
      <p className="">
        Создан:{" "}
        <strong>
          {new Date(order.created_at).toLocaleString().substring(0, 17)}
        </strong>
      </p>
      <p className="">
        Последнее изменение:{" "}
        <strong>
          {new Date(order.updated_at).toLocaleString().substring(0, 17)}
        </strong>
      </p>
      <p className="">
        Покупатель:{" "}
        <strong>
          {order.first_name} {order.last_name}
        </strong>
      </p>
      <p className="">
        Телефон: <strong>{order.phone}</strong>
      </p>
      {items.map((item) => (
        <div
          key={item.id}
          className="w-full border-b border-gray-900 text-secondary"
        >
          <div className="w-full">
            <div className="w-full flex items-center justify-between">
              <Link
                href={`/product/${item.product_id}?productName=${item.product_name}`}
                className="flex gap-2 items-center text-xs line-clamp-2"
              >
                {/* о товаре */}
                <div className="w-20 h-20">
                  <ProductImage
                    productId={item.product_id}
                    cloudPath={cloudPath}
                  />
                </div>
                <span className="hidden md:block max-w-[80%]">
                  {item.product_name}
                </span>
                <div className="flex">
                  <span className="">{item.product_weight}</span>
                  <span className="">{item.product_unit}</span>
                </div>
                <span className="">{item.product_price}₽</span>
              </Link>

              {/* итого */}
              <div className="flex justify-end gap-5 lg:gap-10">
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

      <div className="w-full flex justify-end items-center pt-5 border-t border-accent text-xl">
        <p className={font_bold.className}>{order.total_sum}₽</p>
      </div>

      {order.type === "доставка" && (
        <div>
          <label className="mb-3 label">Адрес доставки:</label>
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
    </main>
  );
}
