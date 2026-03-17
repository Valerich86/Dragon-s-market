"use client";

import { font_mg, font_heading } from "@/lib/fonts";
import Image from "next/image";
import Headline from "../UI/headline";

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
    icon: "/images/icons/4.png",
  },
  {
    day: "Вторник",
    description: "День заряда энергии",
    categories: "Напитки • Лапша • Соусы",
    bgColor: " #FC9B5E",
    borderColor: "#FF6600",
    icon: "/images/icons/5.png",
  },
  {
    day: "Среда",
    description: "День сладкого перевала",
    categories: "Мармелад • Сухофрукты • Желе",
    bgColor: "#FEB9C3",
    borderColor: "#FF99CC",
    icon: "/images/icons/6.png",
  },
  {
    day: "Четверг",
    description: "День вкуса и ритуалов",
    categories: "Шоколад • Чай • Печенье",
    bgColor: " #A7CF9A",
    borderColor: "#336666",
    icon: "/images/icons/7.png",
  },
];

const daysInfo2 = [
  {
    day: "Пятница",
    description: "День вечеринок",
    categories: "Чипсы • Токпокки • Закуски",
    bgColor: "#BB99CC",
    borderColor: "#9900CC",
    icon: "/images/icons/1.png",
  },
  {
    day: "Суббота",
    description: "День развлечений",
    categories: "Соевые снеки • Брелоки • Карточки",
    bgColor: "#FED17F",
    borderColor: "#FFBA24",
    icon: "/images/icons/2.png",
  },
  {
    day: "Воскресенье",
    description: "День релакса",
    categories: "Моти • Игрушки • Весовые конфеты",
    bgColor: "#FA7D7D",
    borderColor: "#FF0000",
    icon: "/images/icons/3.png",
  },
];

export default function DiscountPlan() {
  const DayItem = ({ item }: { item: DayInfo }) => {
    return (
      <div
        className={`${font_mg.className} text-primary border-5 rounded-2xl w-full
      flex flex-col justify-center items-center gap-1 py-2 relative`}
        style={{ backgroundColor: item.bgColor, borderColor: item.borderColor }}
      >
        <p className="uppercase">
          <span className={`${font_heading.className}`}>{item.day}: </span>
          {item.description}
        </p>
        <p className="text-xs lg:text-sm">{item.categories}</p>
        <Image
          src={item.icon}
          alt="иконка дня недели"
          width={300}
          height={300}
          loading="lazy"
          className="h-[120%] lg:h-[130%] z-10 w-auto absolute -left-4 top-1/2 -translate-y-[50%] hover:cursor-pointer hover:scale-110 hover:rotate-10 active:rotate-10 active:scale-110 transition-transform duration-300"
        />
      </div>
    );
  };

  return (
    <section area-label="план скидок" className="section x-spacing">
      <Headline text="Драконий план скидок" emojiIndex={19}/>
      <div className="w-full flex flex-wrap gap-1 lg:gap-2 justify-center text-xs lg:text-lg">
        <div className="flex flex-col gap-1 lg:gap-2 w-full lg:w-[45%]">
          {daysInfo1.map((item, index) => (
            <DayItem key={index} item={item} />
          ))}
        </div>
        <div className="flex flex-col gap-1 lg:gap-2 w-full lg:w-[45%]">
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
