"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import useSound from "use-sound";

interface OrderId {
  id: number;
}

export default function OrderNotifications() {
  const [notifications, setNotifications] = useState<OrderId[]>([]);
  const prevNotifications = useRef<OrderId[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders?autoFetch=true");
        const orderIds: OrderId[] = (await response.json()).orders;
        console.log("сравнение: ", arraysEqual(prevNotifications.current, orderIds));
        // Сравниваем с предыдущим состоянием
        if (!arraysEqual(prevNotifications.current, orderIds)) {
          setNotifications(orderIds);
          prevNotifications.current = [...orderIds]; // Обновляем предыдущее состояние
          const audio = new Audio('/sound/notification.mp3');
          audio.play().catch((e) => console.error('Звук не воспроизведён:', e));
        }
      } catch (error) {
        console.error("Ошибка загрузки заказов:", error);
      }
    };
    fetchOrders();
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
        <div className="flex flex-col justify-end h-[90vh] gap-5 absolute right-5 top-5 overflow-x-hidden overflow-y-auto z-50">
          {notifications.map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-accent p-2 rounded"
            >
              Новый заказ № {item.id}
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}
