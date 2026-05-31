"use client";

import { font_light } from "@/lib/fonts";
import type { Order } from "@/lib/types";

interface OrdersStatsProps {
  orders: Order[];
  startDate: string;
  endDate: string;
  status: string;
}

type User = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  orderCount: number;
};

export default function OrdersStats({
  orders,
  startDate,
  endDate,
  status,
}: OrdersStatsProps) {
  // Расчёт общей статистики
  const totalOrders = orders.length;
  const totalSum = orders.reduce(
    (sum, order) => sum + Number(order.total_sum),
    0,
  );
  const itemsSum = orders.reduce(
    (sum, order) => sum + Number(order.items_sum),
    0,
  );
  const assemblyProfit = orders.reduce(
    (sum, order) => sum + Number(order.assembly_cost),
    0,
  );

  // Группировка пользователей по количеству заказов (топ-10)
  const userStats: User[] = Object.values(
    orders.reduce(
      (acc, order) => {
        console.log(order);
        const userId = `${order.first_name}-${order.last_name}-${order.phone}`;
        if (!acc[userId]) {
          acc[userId] = {
            first_name: order.first_name,
            last_name: order.last_name,
            phone: order.phone,
            email: order.email,
            orderCount: 0,
          };
        }
        acc[userId].orderCount++;
        console.log(acc);
        return acc;
      },
      {} as Record<string, User>,
    ),
  )
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 10);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md mb-8">
      <h2
        className={`${font_light.className} text-primary text-xl font-semibold mb-6`}
      >
        Статистика за период {startDate} - {endDate}. Статус "{status}".
      </h2>

      {/* Основная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-4 border bg-accent rounded-lg">
          <h3 className="text-sm mb-1">Всего заказов</h3>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="p-4 border bg-accent rounded-lg">
          <h3 className="text-sm mb-1">Сумма заказов</h3>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("ru-RU").format(totalSum)} ₽
          </p>
        </div>
        <div className="p-4 border bg-accent rounded-lg">
          <h3 className="text-sm mb-1">Сумма товаров</h3>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("ru-RU").format(itemsSum)} ₽
          </p>
        </div>
        <div className="p-4 border bg-accent rounded-lg">
          <h3 className="text-sm mb-1">Прибыль за сборку</h3>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("ru-RU").format(assemblyProfit)} ₽
          </p>
        </div>
      </div>

      {/* Топ-10 пользователей */}
      <div className="text-primary">
        <h3 className="text-lg font-semibold mb-4">
          Топ-10 пользователей по количеству заказов
        </h3>
        {userStats.length > 0 ? (
          <div className="overflow-x-auto text-xs">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th>№</th>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Email</th>
                  <th>Кол-во заказов</th>
                </tr>
              </thead>
              <tbody>
                {userStats.map((user, index) => (
                  <tr
                    key={`${user.phone}-${user.email}`}
                    className="hover:bg-gray-50"
                  >
                    <td>{index + 1}</td>
                    <td>
                      {user.first_name} {user.last_name}
                    </td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td className="font-extrabold">{user.orderCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">Нет данных о пользователях</p>
        )}
      </div>
    </div>
  );
}
