"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" && (
        <button
          className="link fixed left-0 x-spacing top-18 text-3xl opacity-60 z-50 text-secondary dark:text-primary"
          onClick={() => {
            router.back();
            window.scrollTo(0, 0);
          }}
        >
          ⇦
        </button>
      )}
    </>
  );
}
