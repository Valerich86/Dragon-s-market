"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface OrderId {id: number};

export default function OrderNotifications() {
  const [notifications, setNotifications] = useState<OrderId[]>([]);
  const prevNotifications = useRef<OrderId[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders?autoFetch=true");
        const orderIds: OrderId[] = (await response.json()).orders;
        // Сравниваем с предыдущим состоянием
        if (!arraysEqual(prevNotifications.current, orderIds)) {
          if (prevNotifications.current.length < orderIds.length) {
            const audio = new Audio("/sound/notification.mp3");
            audio.play();
          }
          setNotifications(orderIds);
          prevNotifications.current = [...orderIds]; 
        }
      } catch (error) {
        console.error("Ошибка загрузки заказов:", error);
      }
    };
    fetchOrders();
    // проверяем новые заказы каждые 2 минуты
    const interval = setInterval(fetchOrders, 120000);
    return () => clearInterval(interval);
  }, []);

  // Функция сравнения массивов
  const arraysEqual = (a: OrderId[], b: OrderId[]): boolean => {
    if (a.length !== b.length) return false;
    // Сортируем по id перед преобразованием в строку
    const sortedA = [...a].sort((x, y) => x.id - y.id);
    const sortedB = [...b].sort((x, y) => x.id - y.id);
    return JSON.stringify(sortedA) === JSON.stringify(sortedB);
  };

  if (notifications.length === 0) return null;

  return (
    <>
      {notifications.length > 0 && (
        <div className={
          `flex flex-col gap-5 fixed h-[30vh] right-5 top-[60vh] 
          overflow-x-hidden overflow-y-auto z-50 bg-gray-700 p-3 rounded`
        }>
          {notifications.map((item, index) => (
            <Link href={`/admin/orders/details/${item.id}`} key={index}>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-accent p-2 rounded"
              >
                Новый заказ № {item.id}
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
