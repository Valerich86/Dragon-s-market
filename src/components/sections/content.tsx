"use client";

import Image from "next/image";
import { Content } from "@/lib/types";
import Headline from "../UI/headline";
import { motion } from "framer-motion";
import Link from "next/link";

interface Props {
  content: Content[];
}

export default function ContentSection({ content }: Props) {
  const ContentItem = ({ item }: { item: Content }) => {
    const isOnlyMedia = item.info.length === 0 || !item.info; 
    const isVideo = item.media_url
      ? /\.(mp4|mov|webm|ogg|avi|wmv)$/i.test(item.media_url)
      : false;
    return (
      <div className={isOnlyMedia ? "md:w-1/3" : ""}>
        {item.title && <Headline text={item.title} />}
        <div
          className={`w-full flex flex-col md:flex-row gap-10 
            justify-center md:justify-between items-center mt-10`}
        >
          {item.media_url && !isVideo && (
            <motion.div
              initial={{ scale: 0.9, rotate: -4 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className={
                `flex items-center justify-center rounded-xl h-[70vh] w-full ${isOnlyMedia ? "" : "md:w-1/2"}`
              }
            >
              <Image
                src={item.media_url}
                alt="иллюстрация к контенту"
                width={200}
                height={200}
                loading="lazy"
                className={`h-full w-auto ${isOnlyMedia ? "object-cover" : "object-contain"} rounded-xl`}
              />
            </motion.div>
          )}

          {/* текст новости или конкурса */}
          {item.info.length > 0 && (
            <div className={
              `${item.media_url ? "md:w-1/2" : "justify-center"} 
              w-full min-h-[70vh] flex flex-col justify-between items-center 
              md:items-start gap-5 rounded-xl p-5 shadow-[0px_0px_40px_5px_rgba(59,130,246,0.15)]`
            }>
              <pre className="whitespace-pre-wrap text-left md:text-left">
                {item.info}
              </pre>
              <div className="w-full flex justify-end gap-5 text-xs mt-5">
                {item.type === "news" && <p>{new Date(item.created_at).toLocaleDateString()}</p>}
                {item.link_name && item.link_href && (
                  <Link
                    href={item.link_href}
                    className="link underline-offset-2 animate-pulse"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.link_name} ➢
                  </Link>
                )}
              </div>
            </div>
          )}
          {item.media_url && isVideo && (
            <motion.div
              initial={{ scale: 0.9, rotate: 4 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                // Анимация в обе стороны будет одинаковой
              }}
              className="h-[70vh] w-full md:w-1/2 flex items-center justify-center rounded-xl"
            >
              <video
                onContextMenu={(e) => e.preventDefault()}
                autoPlay
                preload="auto"
                muted
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                loop={true}
                controls={false}
                className={`h-full w-auto object-contain pointer-events-none select-none rounded-xl`}
              >
                <source src={item.media_url} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section aria-label="контент" className="section">
      <div className={`w-full flex flex-wrap justify-between gap-y-30`}>
        {content.map((item) => (
          <ContentItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
