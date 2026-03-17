'use client';

import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import type { Category } from "@/lib/types";
import { useRouter } from "next/navigation";
import { font_accent } from "@/lib/fonts";

interface Props {
  category: Category;
  cloudPath: string;
}

export default function CategoryItem ({ category, cloudPath }:Props) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    const backgroundUrl = `${cloudPath}/categories/${category.image_url}`;
    const router = useRouter();

    return (
      <motion.div
        ref={ref}
        initial={{  scale: 0.9 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={
          `w-full lg:w-[45%] h-[35vh] relative link rounded-xl shadow-xl bg-center
          bg-cover bg-no-repeat after:absolute after:inset-0 after:bg-black
          after:opacity-70 after:content-empty after:rounded-xl`
        }
        style={{
          backgroundImage: `url(${backgroundUrl})`,
        }}
        onClick={() =>
          router.push(`/catalog/${category.id}?categoryName=${category.name}`)
        }
      >
        <div className="absolute h-full w-full z-10 flex flex-col items-center justify-around text-center p-3 text-secondary">
          <h2 className={`${font_accent.className} uppercase`}>{category.name}</h2>
          <p>{category.description}</p>
        </div>
      </motion.div>
    );
  };

