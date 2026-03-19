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

export const metadata: Metadata = {
  // title: "Главная",
  description: "Главная страница содержит приветственную секцию, последние новости и акции, товары-новинки",
};

export default async function Home() {
  const cloudPath = await useCloudPath();
  // const carouselProducts = await pool.query(`SELECT * FROM products WHERE to_carousel=TRUE AND is_active=TRUE AND remains>0`);

  return (
    <main area-label='главная страница' className={
      `w-full overflow-x-hidden pb-50`
    }>
      <BGBlob src={"/images/bg-blob.webp"} />
      <HeroSection cloudPath={cloudPath}/>
      <DiscountPlan />
      <CarouselSection cloudPath={cloudPath}/>
      {/* <NewsSection cloudPath={cloudPath}/> */}
      {/* <AboutSection cloudPath={cloudPath}/> */}
      {/* <AssortmentSection cloudPath={cloudPath}/> */}
    </main>
  );
}
