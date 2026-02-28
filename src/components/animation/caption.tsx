"use client";
import { motion } from "framer-motion";
import { font_accent } from "@/lib/fonts";

interface TextAnimationProps {
  text: string;
  className?: string;
  startDelay?: number;
  animate?: boolean;
}

export default function AnimatedCaption({text, className="", startDelay=0, animate=true}:TextAnimationProps) {
  const arr = [...text];

  return (
    <div className={className}>
      {arr.map((char, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            opacity: { duration: 1, delay: animate ? startDelay + index/20 : startDelay },
          }}
          className={`${char === 'н' || char === 'а' ? "bg-unique flex justify-center items-center" : ""}`}
        >
          {char === " " ? "\u2002" : char}
        </motion.div>
      ))}
    </div>
  );
}
