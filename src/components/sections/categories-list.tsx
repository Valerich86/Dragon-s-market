"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Category } from "@/lib/types";
import { font_mg } from "@/lib/fonts";

interface Props {
  categories: Category[];
}

export default function CategoriesList({ categories }: Props) {
  const pathName = usePathname();

  return (
    <div className="w-full flex flex-wrap gap-5 text-xs lg:text-sm justify-between items-center">
      {categories.map((item) => (
        <Link
          href={
            item.id === 0
              ? `/catalog`
              : `/catalog/${item.id}?categoryName=${item.name}`
          }
          key={item.id}
          className={
            `link ${pathName === `/catalog/${item.id}` 
            || (pathName === "/catalog" && item.id === 0) ? "bg-accent" : ""} 
            ${item.id === 0 ? `uppercase ${font_mg.className}` : ""} rounded p-1`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
