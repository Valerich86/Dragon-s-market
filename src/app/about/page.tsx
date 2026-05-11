import NoInfo from "@/components/UI/no-info";
import ContentSection from "@/components/sections/content";
import { getContent } from "@/lib/actions";
import { useCloudPath } from "@/lib/cloud";
import { font_light } from "@/lib/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "О нас",
  description: 'Описание магазина "Драконий базар", г. Пермь',
};

export default async function NewsPage() {
  const cloudPath = useCloudPath();
  const { content } = await getContent("about");

  if (!content || content.length === 0) return <NoInfo />

  return (
    <main
      aria-label="О нас"
      className={`w-full overflow-x-hidden min-h-screen x-spacing py-30 flex flex-col`}
    >
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Немного о нас
      </h1>

      {content && content.length !== 0 && <ContentSection content={content}/>}
    </main>
  );
}
