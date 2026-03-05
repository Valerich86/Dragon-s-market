import BGBlob from "@/components/UI/bg-blob";
import { Metadata } from "next";
import NewsList from "@/components/lists/news";

export const metadata: Metadata = {
  title: "Новости",
  description:
    'Новости и конкурсы магазина "Драконий базар", Пермь',
  keywords: [
    "азиатские снеки",
    "конкурсы",
    "новости",
    "Драконий базар",
  ],
};

export default async function CategoriesPage() {
  return (
    <main area-label="новости" className={`w-full overflow-x-hidden pt-30 pb-50`}>
      <BGBlob src={"/images/bg-blob.webp"} />
      <NewsList />
    </main>
  );
}
