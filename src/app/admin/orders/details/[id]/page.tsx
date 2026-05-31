"use client";

import { useState, useEffect } from "react";
import { font_bold } from "@/lib/fonts";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Order, OrderItem, orderStatuses } from "@/lib/types";
import Loading from "@/app/loading";
import NoInfo from "@/components/UI/no-info";
import ProductImage from "@/components/UI/product-image";

export default function Orders() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [cloudPath, setCloudPath] = useState("");
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [items, setItems] = useState<OrderItem[]>([]);

  // Первый useEffect: загрузка данных при монтировании
  useEffect(() => {
    const fetchOrder = async () => {
      setIsFetching(true);
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
        setIsFetching(false);
      }
    };
    fetchOrder();
  }, [id]); // Зависимость от id — если id изменится, перезапросим данные

  // Второй useEffect: обновление статуса (только если order существует)
  useEffect(() => {
    // Проверяем, есть ли order и не находится ли компонент в процессе загрузки
    if (!order || isFetching) return;
    handleUpdateStatus();
  }, [order, id, isFetching]); // Зависимости: order, id, isFetching

  const handleUpdateStatus = async () => {
    try {
      await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: order?.status }),
      });
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
    }
  };

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
      <form
        className="w-full flex flex-col lg:flex-row lg:justify-between gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateStatus();
        }}
      >
        <p className="">Текущий статус:</p>
        <select
          value={order.status}
          onChange={(e) =>
            setOrder((prev) =>
              prev ? { ...prev, status: e.target.value } : undefined,
            )
          }
          className="input focus:ring-2 focus:ring-indigo-700 focus:border-transparent cursor-pointer"
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
        Ожидается:{" "}
        <strong>
          {new Date(order.expected_arrival_time)
            .toLocaleString()
            .substring(0, 17)}
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
      <p className="">
        Email: <strong>{order.email}</strong>
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

      <p className="">
        Товары, сумма: <strong>{order.items_sum}</strong>
      </p>
      <p className="">
        Сборка: <strong>{order.assembly_cost}</strong>
      </p>
      <p className="">
        Доставка: <strong>{order.delivery_cost}</strong>
      </p>

      <div className="w-full flex justify-end items-center pt-5 border-t border-accent text-xl">
        <p className={font_bold.className}>Итого: {order.total_sum}₽</p>
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
