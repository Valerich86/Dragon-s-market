"use client";

import { font_mg, font_montserrat } from "@/lib/fonts";
import Image from "next/image";

type DayInfo = {
  day: string;
  description: string;
  categories: string;
  bgColor: string;
  borderColor: string;
  icon: string;
};

const daysInfo1 = [
  {
    day: "Понедельник",
    description: "День рутине - нет!",
    categories: "Конфеты в упаковках • Жвачки",
    bgColor: "#BDDCEB",
    borderColor: "#9999FF",
    icon: "/images/icons/4.webp",
  },
  {
    day: "Вторник",
    description: "День заряда энергии",
    categories: "Напитки • Лапша • Соусы",
    bgColor: " #FC9B5E",
    borderColor: "#FF6600",
    icon: "/images/icons/5.webp",
  },
  {
    day: "Среда",
    description: "День сладкого перевала",
    categories: "Мармелад • Сухофрукты • Желе",
    bgColor: "#FEB9C3",
    borderColor: "#FF99CC",
    icon: "/images/icons/6.webp",
  },
  {
    day: "Четверг",
    description: "День вкуса и ритуалов",
    categories: "Шоколад • Чай • Печенье",
    bgColor: " #A7CF9A",
    borderColor: "#336666",
    icon: "/images/icons/7.webp",
  },
];

const daysInfo2 = [
  {
    day: "Пятница",
    description: "День вечеринок",
    categories: "Чипсы • Токпокки • Закуски",
    bgColor: "#BB99CC",
    borderColor: "#9900CC",
    icon: "/images/icons/1.webp",
  },
  {
    day: "Суббота",
    description: "День развлечений",
    categories: "Соевые снеки • Брелоки • Карточки",
    bgColor: "#FED17F",
    borderColor: "#FFBA24",
    icon: "/images/icons/2.webp",
  },
  {
    day: "Воскресенье",
    description: "День релакса",
    categories: "Моти • Игрушки • Весовые конфеты",
    bgColor: "#FA7D7D",
    borderColor: "#FF0000",
    icon: "/images/icons/3.webp",
  },
];

export default function DiscountPlan() {
  const DayItem = ({ item }: { item: DayInfo }) => {
    return (
      <div
        className={`${font_mg.className} text-primary border-5 rounded-2xl w-full
      flex flex-col justify-center items-center gap-2 py-3 relative`}
        style={{ backgroundColor: item.bgColor, borderColor: item.borderColor }}
      >
        <p className="uppercase">
          <span className={`${font_montserrat.className}`}>{item.day}: </span>
          {item.description}
        </p>
        <p>{item.categories}</p>
        <Image
          src={item.icon}
          alt="иконка дня недели"
          width={200}
          height={200}
          loading="lazy"
          className="h-[80%] lg:h-full w-auto absolute -top-8 -left-4 lg:-left-8 lg:top-1/2 lg:-translate-y-[50%] hover:cursor-pointer hover:scale-110 hover:rotate-10 active:animate-ping transition-transform duration-300"
        />
      </div>
    );
  };

  return (
    <section area-label="план скидок" className="section x-spacing">
      <div className="w-full flex justify-center">
        <Image
          src={"/images/plan-heading.webp"}
          alt="заголовок"
          width={200}
          height={200}
          loading="eager"
          className="w-[90%] lg:w-1/3 h-auto mb-10"
        />
      </div>
      <div className="w-full flex flex-wrap gap-10 justify-center text-sm lg:text-lg">
        <div className="flex flex-col gap-10 w-full lg:w-[45%]">
          {daysInfo1.map((item, index) => (
            <DayItem key={index} item={item} />
          ))}
        </div>
        <div className="flex flex-col gap-10 w-full lg:w-[45%]">
          {daysInfo2.map((item, index) => (
            <DayItem key={index} item={item} />
          ))}
          <div className="text-secondary w-full text-center lg:text-left">
            <p>Каждый день в нашем магазине скидка 15 % на определёенные категории товаров</p>
          </div>
        </div>
        <p>скидка действует только при офлайн покупке*</p>
      </div>
    </section>
  );
}
