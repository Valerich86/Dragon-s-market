import BGBlob from "@/components/UI/bg-blob";
import { Metadata } from "next";
import InfoList from "@/components/lists/info";
import { useCloudPath } from "@/lib/cloud";

export const metadata: Metadata = {
  title: "О товарах",
  description: 'Ассортимент магазина "Драконий базар", Пермь',
  keywords: ["азиатские снеки", "ассортимент", "Драконий базар"],
};

export default async function AssortmentPage() {
  const cloudPath = await useCloudPath();
  return (
    <main area-label="о товарах" className={`w-full overflow-x-hidden pt-30 pb-50`}>
      <BGBlob src={"/images/bg-blob.webp"} />
      <InfoList type={"assortment"} cloudPath={cloudPath}/>
    </main>
  );
}
