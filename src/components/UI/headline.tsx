"use client";

import { font_heading } from "@/lib/fonts";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface Props {
  text: string;
  emojiIndex: number;
}

export default function Headline({ text, emojiIndex }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const parts = [
    text.slice(0, emojiIndex - 1),
    <Image
      src={"/images/emoji.webp"}
      alt="Смайлик"
      width={50}
      height={50}
      className="inline-block align-middle -mx-2 animate-emodji"
    />,
    text.slice(emojiIndex),
  ];

  return (
    <h1 className={`${font_heading.className} text-3xl text-center lg:text-5xl lg:mb-10`}>
      {parts.map((part, index) =>
        <span key={index}>{part}</span>
      )}
    </h1>
  );
  // return (
  //     <motion.div
  //       ref={ref}
  //       initial={{ x: -50 }}
  //       animate={inView ? { x: 0 } : {}}
  //       transition={{ duration: 0.3, ease: "easeOut" }}
  //       className={`w-full h-full flex justify-center items-center`}
  //     >
  //       <div
  //         className={`${font_heading.className} w-full text-center text-3xl lg:text-5xl flex`}
  //       >
  //         <h1>{text.substring(0, emojiIndex - 1)}</h1>
  //           <Image
  //           src={"/images/emoji.webp"}
  //           alt="Смайлик"
  //           width={100}
  //           height={100}
  //           className="w-1/5 inline-block h-auto"
  //         />
  //       </div>
  //     </motion.div>
  // );
}
