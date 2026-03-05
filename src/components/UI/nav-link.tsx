"use client";

import { font_decor } from "@/lib/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  name: string;
  options?: string;
}

export default function NavLink({ href, name, options="" }: NavLinkProps) {
  const pathName = usePathname();

  return (
    <div className={`${pathName === href ? "bg-accent text-primary" : "bg-none text-secondary"} text-sm px-4 h-full flex items-center`}>
      <Link href={href} className={`flex items-baseline link ${options}`}>
        <span className={`${font_decor.className} italic text-xl`}>
          {name[0]}
        </span>
        <span>{name.substring(1)}</span>
      </Link>
    </div>
  );
}
