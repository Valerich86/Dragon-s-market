"use client";

import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { font_light } from "@/lib/fonts";
import { motion } from "framer-motion";
import { AiTwotoneDelete, AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import type { Order } from "@/lib/types";
import CustomButton from "@/components/UI/custom-button";
import Loading from "@/app/loading";
import NoInfo from "@/components/no-info";
import { orderStatuses } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("создан");
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/admin/orders?status=${selectedStatus}`,
        );
        const { orders } = await response.json();
        setOrders(orders);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [selectedStatus, refresh]);

  return (
    <main
      aria-label="управление заказами"
      className="w-full overflow-x-hidden px-5 lg:pr-25 py-10"
    >
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Управление заказами
      </h1>
      <fieldset className="w-full md:w-1/2 lg:w-1/3 mb-10 relative">
        <label className="label">Выберите нужный статус</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="input focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {orderStatuses.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </fieldset>
      {isLoading && <Loading />}
      {!isLoading && orders.length === 0 && <NoInfo />}
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
                  href={`/admin/orders/details/${item.id}`}
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
