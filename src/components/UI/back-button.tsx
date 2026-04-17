"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CartContext } from "@/context/cart-context";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [previousPathname, setPreviousPathname] = useState<string>("");

  // Отслеживаем изменение пути и сохраняем предыдущий
  useEffect(() => {
    if (previousPathname !== pathname) {
      setPreviousPathname(pathname);
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0 });
      }, 100);
    }
  }, [pathname, previousPathname]);

  const handleBack = () => {
    router.refresh();
    router.back()
    // setTimeout(() => router.back(), 50);
  };

  return (
    <>
      {pathname !== "/" && pathname !== "/privacy-policy" && !pathname.startsWith("/admin") && (
        <button
          className="link fixed left-0 x-spacing top-18 text-3xl opacity-60 z-40 text-secondary"
          onClick={handleBack}
        >
          ⇦
        </button>
      )}
    </>
  );
}
