"use client";

import { useState, useEffect } from "react";
import { font_light } from "@/lib/fonts";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Order } from "@/lib/types";
import Loading from "@/app/loading";
import NoInfo from "@/components/UI/no-info";
import { orderStatuses } from "@/lib/types";
import OrdersChart from "@/components/tools/orders-chart";
import OrdersStats from "@/components/tools/orders-stats";
import CustomButton from "@/components/UI/custom-button";

export default function AdminOrdersPage() {
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1); // правильно меняем месяц
    return oneMonthAgo.toISOString().split("T")[0];
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("создан");
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openStats, setOpenStats] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/admin/orders?status=${selectedStatus}&startDate=${startDate}&endDate=${endDate}`,
        );
        const { orders } = await response.json();
        setOrders(orders);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [selectedStatus, startDate, endDate, refresh]);

  return (
    <main
      aria-label="управление заказами"
      className="w-full overflow-x-hidden px-5 lg:pr-25 py-10"
    >
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Управление заказами
      </h1>
      <div className="w-full mb-10 relative flex flex-col md:flex-row md:justify-between md:items-baseline-last gap-5">
        <fieldset>
          <label className="label">Начальная дата</label>
          <input
            className="input cursor-pointer"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </fieldset>
        <fieldset>
          <label className="label">Конечная дата</label>
          <input
            className="input cursor-pointer"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </fieldset>
        <fieldset>
          <label className="label">Cтатус</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input focus:ring-2 focus:ring-indigo-700 focus:border-transparent cursor-pointer"
          >
            {orderStatuses.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </fieldset>
        <CustomButton
          text={openStats ? "Скрыть статистику" : "Показать статистику"}
          onClick={() => setOpenStats(prev => !prev)}
          options="w-full md:w-50 h-10"
        />
      </div>
      {isLoading && <Loading />}
      {!isLoading && orders.length === 0 && <NoInfo />}
      {!isLoading && orders.length > 0 && (
        <>
          {openStats && (
            <>
              <OrdersChart
                orders={orders}
                startDate={new Date(startDate).toLocaleDateString()}
                endDate={new Date(endDate).toLocaleDateString()}
                status={selectedStatus}
              />
              <OrdersStats
                orders={orders}
                startDate={new Date(startDate).toLocaleDateString()}
                endDate={new Date(endDate).toLocaleDateString()}
                status={selectedStatus}
              />
            </>
          )}
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
                      <span>
                        {new Date(item.updated_at)
                          .toLocaleString()
                          .substring(0, 17)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
