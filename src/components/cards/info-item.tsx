'use client';

import type { Info } from "@/lib/types";
import Headline from "../UI/headline";
import MascotAnimation from "../animation/mascot-bonus";
import { motion } from "framer-motion";
import Image from "next/image";
import CustomButton from "../UI/custom-button";

interface Props {
  item: Info;
  cloudPath: string;
}

export default function InfoItem ({ item, cloudPath }:Props) {
    return (
      <div className="relative">
        {item.title && <Headline text={item.title} />}
        <div className={
          `w-full min-h-screen flex flex-col md:flex-row gap-10 
          justify-center items-center x-spacing ${item.title ? "mt-70" : "mt-20"}`
        }>
          
          {item.media_type === "image" && item.media_url && (
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={`${cloudPath}/info/${item.media_url}`}
                alt="иллюстрация к новости"
                width={200}
                height={200}
                loading="lazy"
                className="w-full h-auto object-cover rounded-2xl"
              />
            </motion.div>
          )}

          {/* текст новости или конкурса */}
          <div className="w-full md:w-2/3 flex flex-col justify-center items-center md:items-start gap-5">
            <pre className="whitespace-pre-wrap text-left md:text-left lg:text-sm">
              {item.content}
            </pre>
            {item.optional_link_url && (
              <CustomButton
                onClick={() =>
                  window.open(item.optional_link_url, "_blank", "noopener,noreferrer")
                }
                text="Участвовать"
                options="w-full lg:w-1/3"
              />
            )}
          </div>
        </div>
      </div>
    );
  };