"use client";

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
    <div className={`${pathName.startsWith(href) ? "bg-accent" : "bg-none"} text-secondary text-xs md:text-sm px-4 h-full flex hover:bg-accent transition-colors duration-500 items-center`}>
      <Link href={href} className={`flex items-baseline ${options}`}>
        {name}
      </Link>
    </div>
  );
}
