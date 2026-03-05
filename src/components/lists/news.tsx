"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Headline from "../UI/headline";
import type { News } from "@/lib/types";
import CustomButton from "../UI/custom-button";
import MaskotAnimation from "../animation/maskot";
import Loading from "@/app/loading";

export default function NewsList() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/news");
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

  const NewsItem = ({ item }: { item: News }) => {
    return (
      <div className="relative">
        <Headline text={item.title} />
        <div className="w-full min-h-screen flex flex-col md:flex-row justify-center items-center mt-70 x-spacing">
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

          {/* изображение или анимация */}
          {item.media_type === "video" && (
            <MaskotAnimation src={item.url} />
          )}
          {item.media_type === "image" && (
            <Image
              src={item.url}
              alt="иллюстрация к новости"
              width={200}
              height={200}
              loading="lazy"
              className="h-full w-auto object-cover"
            />
          )}
        </div>
      </div>
    );
  };

  if (loading) return <Loading/>;

  // Защита от map для undefined/null
  if (!news || news.length === 0)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Нет новостей
      </div>
    );

  return (
    <div aria-label="новости" className="w-full flex flex-col justify-center items-center gap-10 md:gap-0">
      {news.map((item) => (
        <NewsItem key={item.id} item={item} />
      ))}
    </div>
  );
}
