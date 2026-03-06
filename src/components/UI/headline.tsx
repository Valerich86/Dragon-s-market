"use client";

import {
  font_asian1,
  font_asian2,
  font_asian3,
  font_accent,
} from "@/lib/fonts";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  text: string;
}

export default function Headline({ text }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div
      className={`bg-[url("/images/headline-dark.webp")] dark:bg-[url("/images/headline-light.webp")] fire:bg-[url("/images/headline-light.webp")] bg-center bg-cover lg:bg-contain bg-no-repeat 
        z-10 h-80 flex items-center justify-center top-0 left-1/2 -translate-x-[50%] w-full lg:w-2/3 pb-15 absolute`}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`w-full h-full flex justify-center items-center`}
      >
        <pre
          className={`${font_accent.className} dark:text-secondary fire:text-secondary text-primary text-center text-xl lg:text-2xl`}
        >
          {text}
        </pre>
      </motion.div>
    </div>
  );
}
