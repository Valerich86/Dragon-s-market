"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const options = [
  { name: "Общее", href: "/profile" },
  { name: "Адреса", href: "/profile/addresses" },
  { name: "Заказы", href: "/profile/orders" },
];

export default function ProfileOptions() {
  const [currentOption, setCurrentOption] = useState(options[0]);
  const pathName = usePathname();

  return (
    <div className="w-full flex flex-wrap gap-10 text-xs lg:text-sm justify-between lg:justify-start my-10 border-b border-accent">
      {options.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`link ${pathName === item.href ? "bg-accent" : ""} rounded-t p-1`}
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
