import HeroSection from "@/components/sections/hero";
import type { Metadata } from "next";
import ContentSection from "@/components/sections/content";
import { useCloudPath } from "@/lib/cloud";
import DiscountPlan from "@/components/sections/discount-plan";
import VideoCarouselSection from "@/components/sections/video-carousel";
import { getContent } from "@/lib/actions";
import Link from "next/link";

export const metadata: Metadata = {
  description:
    "Главная страница содержит приветственную секцию, последние новости и акции, товар дня",
};

export default async function Home() {
  const cloudPath = useCloudPath();
  const news = (await getContent("news", 3)).content;
  const about = (await getContent("about", 3)).content;

  return (
    <main
      aria-label="главная страница"
      className={`w-full overflow-x-hidden pb-50`}
    >
      <HeroSection cloudPath={cloudPath} />
      <DiscountPlan />
      <div className="x-spacing mt-10">
        {news && news.length !== 0 && (
          <ContentSection content={news} />
        )}
        <div className="w-full flex justify-end">
          <Link
            href={"/news"}
            className={`text-accent animate-pulse italic mt-5`}
          >
            Все новости ➢
          </Link>
        </div>
      </div>
      <VideoCarouselSection cloudPath={cloudPath} />
      <div className="x-spacing mt-10">
        {about && about.length !== 0 && (
          <ContentSection content={about} />
        )}
        <div className="w-full flex justify-end">
          <Link
            href={"/about"}
            className={`text-accent animate-pulse italic mt-5`}
          >
            Подробнее о нас ➢
          </Link>
        </div>
      </div>
    </main>
  );
}
