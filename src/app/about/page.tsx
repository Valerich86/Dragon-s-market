import BGBlob from "@/components/UI/bg-blob";
import { Metadata } from "next";
import InfoList from "@/components/lists/info";
import { useCloudPath } from "@/lib/cloud";

export const metadata: Metadata = {
  title: "О нас",
  description: 'История магазина "Драконий базар", Пермь',
  keywords: ["азиатские снеки", "история", "Драконий базар"],
};

export default async function AboutPage() {
  const cloudPath = await useCloudPath();
  return (
    <main area-label="о нас" className={`w-full overflow-x-hidden pt-30 pb-50`}>
      <BGBlob src={"/images/bg-blob.webp"} />
      <InfoList type="about" cloudPath={cloudPath}/>
    </main>
  );
}
