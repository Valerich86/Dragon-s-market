import BGBlob from "@/components/UI/bg-blob";
import { Metadata } from "next";
import InfoList from "@/components/lists/info";
import { useCloudPath } from "@/lib/cloud";

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

export default async function NewssPage() {
  const cloudPath = await useCloudPath();
  return (
    <main area-label="новости" className={`w-full overflow-x-hidden pt-30 pb-50`}>
      <BGBlob src={"/images/bg-blob.webp"} />
      <InfoList type="news" cloudPath={cloudPath}/>
    </main>
  );
}
