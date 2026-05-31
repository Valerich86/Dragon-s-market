// components/OrdersChart.tsx
"use client";

import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import type { Order } from "@/lib/types";

ChartJS.register(...registerables);

interface OrdersChartProps {
  orders: Order[];
  startDate: string;
  endDate: string;
  status: string;
}

export default function OrdersChart({ orders, startDate, endDate, status }: OrdersChartProps) {
  // Группируем заказы по дням (убираем время из timestamp)
  const dailyData = orders.reduce((acc, order) => {
    // Валидация и преобразование total_sum в число
    const sum = Number(order.total_sum);
    if (isNaN(sum)) {
      console.warn('Невалидная сумма для заказа:', order.id, 'Сумма:', order.total_sum);
      return acc;
    }

    // Преобразуем timestamp в дату и убираем время (оставляем только YYYY-MM-DD)
    const date = new Date(order.created_at);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    // Инициализируем или добавляем сумму для этой даты (гарантированно число)
    acc[dateKey] = (acc[dateKey] || 0) + sum;
    return acc;
  }, {} as Record<string, number>);

  // Сортируем даты по хронологии
  const sortedDates = Object.keys(dailyData).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Форматируем метки для отображения (день.месяц.год)
  const formattedLabels = sortedDates.map((date) => {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year.slice(-2)}`; // 21.05.26
  });

  const chartData = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Сумма заказов за день (₽)",
        data: sortedDates.map((date) => dailyData[date]),
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "#e23324",
        borderWidth: 3,
        pointBackgroundColor: "#e23324",
        pointBorderColor: "#fff",
        pointHoverRadius: 8,
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Динамика заказов с ${startDate} по ${endDate}. Статус "${status}".`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Сумма (₽)",
        },
        ticks: {
          callback: (value: number | string) => {
            if (typeof value === "number") {
              // Форматирование с разделителями тысяч и символом рубля
              return new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value) + ' ₽';
            }
            return value;
          },
          stepSize: 100, // фиксированный шаг деления оси Y (настройте под свои данные)
        },
        min: 0, // минимум на оси Y — 0
      },
      x: {
        title: {
          display: true,
          text: "Дата",
        },
      },
    },
  };

  // Если нет данных, показываем сообщение
  if (orders.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Нет данных для отображения графика
      </div>
    );
  }

  return (
    <div className="w-full bg-secondary p-6 rounded-lg mb-10">
      <Line data={chartData} options={options} height={300} />
    </div>
  );
}
