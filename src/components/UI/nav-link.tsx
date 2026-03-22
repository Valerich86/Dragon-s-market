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

  function getFirstSegment(pathname: string): string {
    const segments = pathname.split("/");
    return "/" + (segments[1] || "");
  }

  return (
    <div className={`${getFirstSegment(pathName) === href ? "bg-accent" : "bg-none"} text-secondary text-sm px-4 h-full flex hover:bg-accent transition-colors duration-500 items-center`}>
      <Link href={href} className={`flex items-baseline ${options}`}>
        {/* <span className={`${font_decor.className} italic text-xl`}>
          {name[0]}
        </span>
        <span>{name.substring(1)}</span> */}
        {name}
      </Link>
    </div>
  );
}
