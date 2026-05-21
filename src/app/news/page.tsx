import NoInfo from "@/components/UI/no-info";
import ContentSection from "@/components/sections/content";
import { getContent } from "@/lib/server-data";
import { useCloudPath } from "@/lib/cloud";
import { font_light } from "@/lib/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новости",
  description: 'Новости магазина "Драконий базар", г. Пермь',
};

export default async function NewsPage() {
  const cloudPath = useCloudPath();
  const { content } = await getContent("news");

  if (!content || content.length === 0) return <NoInfo />

  return (
    <main
      aria-label="Новости"
      className={`w-full overflow-x-hidden min-h-screen x-spacing py-30 flex flex-col`}
    >
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Наши новости
      </h1>

      {content && content.length !== 0 && <ContentSection content={content}/>}
    </main>
  );
}
