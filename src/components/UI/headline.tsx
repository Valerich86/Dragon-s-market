import {
  font_asian1,
  font_asian2,
  font_asian3,
  font_accent,
} from "@/lib/fonts";
import { motion } from "framer-motion";

interface Props {
  text: string;
}

export default function Headline({ text }: Props) {
  return (
    <div
      className={
        `bg-[url("/images/headline-dark.webp")] dark:bg-[url("/images/headline-light.webp")] bg-center bg-cover lg:bg-contain bg-no-repeat 
        z-10 h-80 flex items-center justify-center top-0 left-1/2 -translate-x-[50%] w-full lg:w-2/3 pb-15 absolute`
      }
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full h-full flex justify-center items-center`}
      >
        <pre
          className={`${font_accent.className} dark:text-secondary text-primary text-center text-md lg:text-2xl`}
        >
          {text}
        </pre>
      </motion.div>
    </div>
  );
}
