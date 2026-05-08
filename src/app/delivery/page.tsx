import NoInfo from "@/components/no-info";
import ContentSection from "@/components/sections/content";
import { getContent } from "@/lib/actions";
import { useCloudPath } from "@/lib/cloud";
import { font_light } from "@/lib/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "О доставке",
  description: 'Инструкция по заказу, оплате и достаке товара из магазина "Драконий базар", г. Пермь',
};

export default async function NewsPage() {
  const cloudPath = useCloudPath();
  const { content } = await getContent("delivery");

  if (!content || content.length === 0) return <NoInfo />

  return (
    <main
      aria-label="О нас"
      className={`w-full overflow-x-hidden min-h-screen x-spacing py-30 flex flex-col`}
    >
      <h1 className={`${font_light.className} uppercase mb-10`}>
        О доставке
      </h1>

      {content && content.length !== 0 && <ContentSection content={content}/>}
    </main>
  );
}
