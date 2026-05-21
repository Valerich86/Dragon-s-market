"use client";

import { useState, useEffect } from "react";
import { font_light } from "@/lib/fonts";
import { motion } from "framer-motion";
import { useProfile } from "@/context/profile-context";
import Link from "next/link";
import type { Order } from "@/lib/types";
import Loading from "@/app/loading";
import NoInfo from "@/components/UI/no-info";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { general } = useProfile();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/orders?userId=${general.id}`);
        const { orders } = await response.json();
        setOrders(orders);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  return (
    <main
      aria-label="заказы"
      className="w-full overflow-x-hidden"
    >
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Ваши заказы
      </h1>
      
      {isLoading && <Loading />}
      {!isLoading && orders.length === 0 && <NoInfo text="Вы ещё ничего не заказывали..."/>}
      {!isLoading && orders.length > 0 && (
        <div className="w-full flex flex-col gap-5">
          {orders.map((item, index) => {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.1,
                  ease: "easeOut",
                  delay: index / 10,
                }}
                className="w-full border-b border-gray-900"
              >
                <Link
                  href={`/profile/orders/${item.id}`}
                  className="link"
                >
                  <div className="text-xs w-full flex flex-wrap items-baseline-last gap-5">
                    <strong className="text-2xl">Заказ № {item.id}</strong>
                    <span>на сумму {item.total_sum}₽,</span>
                    <span>{item.status}</span>
                    <span>{new Date(item.updated_at).toLocaleString().substring(0, 17)}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
