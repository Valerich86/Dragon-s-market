"use client";

import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { font_light } from "@/lib/fonts";
import { motion } from "framer-motion";
import { AiTwotoneDelete, AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import { Content, contentTypes } from "@/lib/types";
import CustomButton from "@/components/UI/custom-button";
import Loading from "@/app/loading";
import NoInfo from "@/components/no-info";

export default function AdminContentPage() {
  const [content, setContent] = useState<Content[]>([]);
  const [selectedType, setSelectedType] = useState("news");
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/admin/content?contentType=${selectedType}`,
        );
        const { content } = await response.json();
        setContent(content);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [selectedType, refresh]);

  return (
    <main
      aria-label="управление контентом"
      className="w-full overflow-x-hidden px-5 lg:pr-25 py-10"
    >
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Управление контентом
      </h1>
      <div className="w-full flex justify-start mb-10">
        <CustomButton
          text="Создать контент"
          options="w-45 h-10"
          onClick={() => redirect("/admin/content/create")}
        />
      </div>
      <fieldset className="w-full md:w-1/2 lg:w-1/3 mb-10">
        <label className="label">Выберите тип контента</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="input focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {contentTypes.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </fieldset>
      {isLoading && <Loading />}
      {!isLoading && content.length === 0 && <NoInfo />}
      {!isLoading && content.length > 0 && (
        <div className="w-full flex flex-col gap-5">
          {content.map((item, index) => {
            const deleteContent = async () => {
              try {
                const response = await fetch(`/api/admin/content/${item.id}`, {
                  method: "DELETE",
                });
                if (response.ok) setRefresh((prev) => !prev);
              } catch (error) {
                console.error(error);
              }
            };
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.1,
                  ease: "easeOut",
                  delay: index / 10,
                }}
                className="w-full border-b border-gray-900"
              >
                <div className="w-full flex items-center justify-start gap-3 lg:gap-10">
                  <Link
                    href={`/admin/content/details/${item.id}`}
                    className="link"
                  >
                    <AiFillEdit size={20} />
                  </Link>
                  <button className="link text-accent" onClick={deleteContent}>
                    <AiTwotoneDelete size={22} />
                  </button>
                </div>
                <div className="text-xs w-full flex items-baseline-last justify-between gap-5">
                  <span>ID: {item.id}</span>
                  <span className="w-[80%] line-clamp-2">{item.info}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
