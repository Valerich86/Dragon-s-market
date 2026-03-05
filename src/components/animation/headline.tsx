"use client";
import { motion } from "framer-motion";
import {
  font_accent,
  font_asian1,
  font_asian2,
  font_asian3,
} from "@/lib/fonts";

interface TextAnimationProps {
  text: string;
}

export default function HeadlineAnimation({text}:TextAnimationProps) {
  const arr = [...text];

  return (
    <div className={`${font_asian1.className} flex`}>
      {arr.map((char, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            opacity: { duration: 1, delay: index/20 },
          }}
          className={`${char === 'н' || char === 'а' ? "bg-accent flex justify-center items-center" : ""}`}
        >
          {char === " " ? "\u2002" : char}
        </motion.div>
      ))}
    </div>
  );
}
