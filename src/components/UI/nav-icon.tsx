"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "@/context/cart-context";
import { font_bold } from "@/lib/fonts";

interface NavLinkProps {
  href: string;
  icon: IconType;
  userId: number;
}

export default function NavIcon({ href, icon, userId }: NavLinkProps) {
  const pathName = usePathname();
  const Icon = icon;
  const { refreshCart } = useContext(CartContext)!;
  const [localCartLength, setLocalCartLength] = useState(0);
  const [total, setTotal] = useState(0);

  // Получаем длину корзины при монтировании и при изменении userId/refreshCart
  useEffect(() => {
    if (userId === 0 || href !== "/cart") return;

    const fetchCartLength = async () => {
      try {
        const response = await fetch(`/api/cart?customer_id=${userId}`);
        const { cart } = await response.json();
        setLocalCartLength(cart.length);
        if (cart.length > 0) setTotal(cart[0].cart_total);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCartLength();
  }, [userId, refreshCart]);

  return (
    <div
      className={`${pathName.startsWith(href) ? "bg-accent" : "bg-none"} text-secondary px-3 h-full flex items-center relative`}
    >
      <Link href={href} className="link">
        <Icon size={20} />
      </Link>
      {href === "/cart" && localCartLength > 0 && pathName.startsWith("/catalog") && (
        <>
          <div className="absolute rounded-full px-1 top-1 -right-1 bg-accent shadow-[0px_0px_5px_-1px_#fefefe] z-10">
            {localCartLength}
          </div>
          <Link href={"/cart"} className={
            `${font_bold.className} fixed rounded-full min-w-25 py-1 px-3 bottom-10 text-xl
            right-5 md:right-10 bg-accent shadow-[0px_0px_40px_25px_rgba(226,51,36,0.3)] border 
            hover:shadow-[0px_0px_40px_25px_rgba(226,51,36,0.5)] transition duration-300 z-10 text-center`
          }>
            {total}₽
          </Link>
        </>
      )}
    </div>
  );
}
