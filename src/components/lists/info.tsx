"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Headline from "../UI/headline";
import type { Info } from "@/lib/types";
import CustomButton from "../UI/custom-button";
import MaskotAnimation from "../animation/maskot";
import Loading from "@/app/loading";
import NoInfo from "../no-info";

interface Props {
  type: string;
  limit?: number;
  cloudPath: string;
}

export default function InfoList({type, limit, cloudPath}:Props) {
  const [info, setInfo] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/info?type=${type}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки данных");
      }
      const { data } = await response.json();
      setInfo(data);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  const InfoItem = ({ item }: { item: Info }) => {
    return (
      <div className="relative">
        {item.title && <Headline text={item.title} />}
        <div className={
          `w-full min-h-screen flex flex-col md:flex-row gap-10 
          justify-center items-center x-spacing ${item.title ? "mt-70" : "mt-20"}`
        }>
          {/* изображение или анимация */}
          {item.media_type === "video" && item.media_url && (
            <MaskotAnimation src={`${cloudPath}/info/${item.media_url}`} />
          )}
          {item.media_type === "image" && item.media_url && (
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: "easeIn" }}
            >
              <Image
                src={`${cloudPath}/info/${item.media_url}`}
                alt="иллюстрация к новости"
                width={200}
                height={200}
                loading="lazy"
                className="h-full w-auto object-cover rounded-2xl"
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

  if (loading) return <Loading />;

  if (!info || info.length === 0) return <NoInfo />
    

  return (
    <div
      aria-label="информационный блок"
      id={type === "news" ? "news" : type === "assortment" ? "assortment" : "about"}
      className="w-full flex flex-col justify-center items-center gap-10 md:gap-0"
    >
      {info.map((item) => (
        <InfoItem key={item.id} item={item} />
      ))}
    </div>
  );
}
