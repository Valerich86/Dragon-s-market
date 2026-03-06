"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Headline from "../UI/headline";
import type { Info } from "@/lib/types";
import CustomButton from "../UI/custom-button";
import MaskotAnimation from "../animation/maskot";
import Loading from "@/app/loading";

interface Props {
  type: string;
  limit?: number;
}

export default function InfoList({type, limit}:Props) {
  const [news, setNews] = useState<Info[]>([]);
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
      setNews(data);
    } catch (error) {
      console.error("Ошибка:", error);
    } finally {
      setLoading(false);
    }
  };

  const NewsItem = ({ item }: { item: Info }) => {
    return (
      <div className="relative">
        {item.title && <Headline text={item.title} />}
        <div className={
          `w-full min-h-screen flex flex-col md:flex-row gap-10 
          justify-center items-center x-spacing ${item.title ? "mt-70" : "mt-20"}`
        }>
          {/* изображение или анимация */}
          {item.media_type === "video" && item.url && (
            <MaskotAnimation src={item.url} />
          )}
          {item.media_type === "image" && item.url && (
            <motion.div
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Image
                src={item.url}
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
            <pre className="whitespace-pre-wrap text-center md:text-left lg:text-sm">
              {item.text}
            </pre>
            {item.link && (
              <CustomButton
                onClick={() =>
                  window.open(item.link, "_blank", "noopener,noreferrer")
                }
                text="Участвовать"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) return <Loading />;

  // Защита от map для undefined/null
  if (!news || news.length === 0)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Нет новостей
      </div>
    );

  return (
    <div
      aria-label="новости"
      className="w-full flex flex-col justify-center items-center gap-10 md:gap-0"
    >
      {news.map((item) => (
        <NewsItem key={item.id} item={item} />
      ))}
    </div>
  );
}
