import HeroSection from "@/components/sections/hero";
import type { Metadata } from "next";
import NewsSection from "@/components/sections/news";
import ProductsSection from "@/components/sections/products";
import BGBlob from "@/components/UI/bg-blob";
import Decor from "@/components/decor";

export const metadata: Metadata = {
  // title: "Главная",
  description: "Главная страница содержит приветственную секцию, последние новости и акции, товары-новинки",
};

export default function Home() {
  return (
    <main area-label='главная страница' className={
      `w-full overflow-x-hidden pb-50`
    }>
      <BGBlob src={"/images/bg-blob.webp"} />
      <HeroSection />
      <NewsSection />
      <ProductsSection />
    </main>
  );
}
