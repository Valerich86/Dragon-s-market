import HeroSection from "@/components/sections/hero";
import type { Metadata } from "next";
import NewsSection from "@/components/sections/news";
import CarouselSection from "@/components/sections/carousel";
import BGBlob from "@/components/UI/bg-blob";
import AboutSection from "@/components/sections/about";
import AssortmentSection from "@/components/sections/assortment";
import { useCloudPath } from "@/lib/cloud";
import { pool } from "@/lib/db";
import DiscountPlan from "@/components/sections/discount-plan";
import VideoCarouselSection from "@/components/sections/video-carousel";

export const metadata: Metadata = {
  // title: "Главная",
  description: "Главная страница содержит приветственную секцию, последние новости и акции, товары-новинки",
};

export default async function Home() {
  const cloudPath = await useCloudPath();

  return (
    <main aria-label='главная страница' className={
      `w-full overflow-x-hidden pb-50`
    }>
      <BGBlob src={"/images/bg-blob.webp"} />
      <HeroSection cloudPath={cloudPath}/>
      <DiscountPlan />
      <VideoCarouselSection cloudPath={cloudPath}/>
      {/* <CarouselSection cloudPath={cloudPath}/> */}
      {/* <NewsSection cloudPath={cloudPath}/> */}
      {/* <AboutSection cloudPath={cloudPath}/> */}
      {/* <AssortmentSection cloudPath={cloudPath}/> */}
    </main>
  );
}
