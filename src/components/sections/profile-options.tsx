"use client";

import Link from "next/link";
import { useState } from "react";

const options = [
  { name: "Общая информация", href: "/profile" },
  { name: "Мои адреса", href: "/profile/addresses" },
  { name: "Мои заказы", href: "/profile/orders" },
  { name: "Избранное", href: "/profile/favourites" },
  { name: "Оставить отзыв", href: "/profile/review" },
];

export default function ProfileOptions() {
  const [currentOption, setCurrentOption] = useState(options[0]);

  return (
    <div className="w-full flex flex-wrap gap-5 text-xs lg:text-sm justify-between my-10">
      {options.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`link ${currentOption === item ? "bg-accent" : ""} rounded p-1`}
          onClick={() => {
            setCurrentOption(item);
          }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
