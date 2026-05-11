"use client";

import Link from "next/link";
import { PiTelegramLogoLight } from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";
import { SlPhone } from "react-icons/sl";
import { usePathname } from "next/navigation";
import { AccessibilityPanel } from "./accessibility-panel";

const links = [
  { name: "О нас", href: "/about" },
  { name: "Новости", href: "/news" },
  { name: "Доставка и оплата", href: "" },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer
      className={`${pathname.startsWith("/admin") ? "hidden" : ""} 
        text-sm absolute bg-gray-700 text-secondary 
        w-full x-spacing flex flex-col lg:text-sm z-10`}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between gap-20 lg:gap-0 py-10 border-b border-gray-200">
        <div className="w-full lg:w-auto flex flex-col gap-5 items-start justify-center">
          <strong className="text-base">ИП Михайлов Александр Сергеевич</strong>
          <p>
            <span className="underline">Юр.адрес:</span> 614051, Пермский край,
            г.Пермь, Уинская 3, 134
          </p>
          <p>
            <span className="underline">
              Фактический (почтовый) адрес Магазина:
            </span>{" "}
            614077, г.Пермь, бульвар Гагарина, 79
          </p>
          <p>
            <span className="underline">ОГРНИП:</span> 324595800153181
          </p>
          <p>
            <span className="underline">ИНН: </span>222210834999
          </p>
        </div>
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-start lg:justify-between gap-10 lg:gap-0">
          <p>ежедневно 10:00 - 22:00 </p>
          <a
            href={"tel:+79223281133"}
            target="_blank"
            aria-label="phone"
            className="link flex gap-2 w-40 h-7 bg-gray-200 rounded-full py-1 text-primary justify-center items-center"
          >
            <SlPhone size={20} />
            <span>+79223281133</span>
          </a>
          <a
            href={"https://t.me/dragonbazarmag"}
            target="_blank"
            aria-label="Telegram"
            className="link flex gap-2 w-40 h-7 bg-gray-200 rounded-full py-1 text-primary justify-center items-center"
          >
            <PiTelegramLogoLight size={25} />
            <span>мы в Telegram</span>
          </a>
          <a
            href="mailto:daleksek@mail.ru?subject=Обращение с сайта"
            target="_blank"
            aria-label="email"
            className="link flex gap-2 w-40 h-7 bg-gray-200 rounded-full py-1 text-primary justify-center items-center"
          >
            <TfiEmail size={20} />
            <span>Задать вопрос</span>
          </a>
        </div>

        <div className="w-full lg:w-auto flex flex-col lg:justify-between gap-10 lg:gap-0">
          {links.map((link, index) => (
            <div key={index} className="w-full text-center lg:text-left">
              <Link className="link" href={link.href}>
                {link.name}
              </Link>
            </div>
          ))}
          <div className="w-full flex justify-center lg:justify-start">
            <AccessibilityPanel />
          </div>
        </div>
      </div>
      <div className="py-10 w-full">
        2026 ⓒ "Драконий базар" - магазин азиатских снеков
      </div>
    </footer>
  );
}
