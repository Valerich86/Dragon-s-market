import Link from "next/link";
import React from "react";
import { PiTelegramLogoLight } from "react-icons/pi";
import { SlPhone } from "react-icons/sl";

type FooterLink = {
  name: string;
  href: string;
};

const leftLinks = [
  { name: "О нас", href: "/about" },
  { name: "Новости", href: "/news" },
  { name: "Отзывы", href: "/" },
];

const rightLinks = [
  { name: "Каталог", href: "/catalog" },
  { name: "Условия оплаты", href: "/delivery" },
  { name: "Условия доставки", href: "/delivery" },
];

export default function Footer() {
  const FooterBlock = ({ links }: { links: FooterLink[] }) => {
    return (
      <div className="w-full lg:w-1/4 flex flex-col justify-center gap-10">
        {links.map((link, index) => (
          <div key={index} className="w-full text-center lg:text-left">
            <Link className="link" href={link.href}>
              {link.name}
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <footer className="absolute bg-maskot2/80 text-primary w-full x-spacing flex flex-col lg:text-xs z-10">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-20 lg:gap-0 py-10 border-b border-gray-200">
        <FooterBlock links={leftLinks} />
        <FooterBlock links={rightLinks} />

        <div className="w-full lg:w-1/4 flex flex-col gap-10 items-center lg:items-start justify-center italic">
          <p>ИП Михайлов А.С.</p>
          <p>г.Пермь, Бульвар Гагарина, 83</p>
          <a
            href={"https://t.me/dragonbazarmag"}
            target="_blank"
            aria-label="Telegram"
            className="link flex gap-2 w-2/3 bg-gray-200 rounded-full py-1 text-secondary justify-center items-center"
          >
            <PiTelegramLogoLight size={20} />
            <span>мы в Telegram</span>
          </a>
        </div>
        <div className="w-full lg:w-1/4">
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A1df9cfcc2a8b054bc91ab82ac71db8f12660013f2ba767cb34bde44ba9ab88bc&amp;source=constructor"
     
            className="rounded-md w-full h-[50vh] lg:h-[35vh]"
          ></iframe>
        </div>
      </div>
      <div className="py-10">
        2026 ⓒ "Драконий базар" - магазин азиатских снеков
      </div>
    </footer>
  );
}
