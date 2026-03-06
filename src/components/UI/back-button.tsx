"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Срабатывает при изменении пути
    if (prevPathname.current !== pathname) {
      // Ждём завершения перехода и прокручиваем вверх
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0 });
      }, 100); // Небольшая задержка для гарантии завершения перехода

      // Обновляем предыдущий путь
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return (
    <>
      {pathname !== "/" && (
        <button
          className="link fixed left-0 x-spacing top-18 text-3xl opacity-60 z-50 text-secondary dark:text-primary fire:text-primary"
          onClick={() => {
            router.back();
          }}
        >
          ⇦
        </button>
      )}
    </>
  );
}
