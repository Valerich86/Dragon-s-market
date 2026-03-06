import BGBlob from "@/components/UI/bg-blob";
import { Metadata } from "next";
import InfoList from "@/components/lists/info";
import { font_accent } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "О нас",
  description: 'История и ассортимент магазина "Драконий базар", Пермь',
  keywords: ["азиатские снеки", "история", "ассортимент", "Драконий базар"],
};

export default async function AboutPage() {
  return (
    <main area-label="о нас" className={`w-full overflow-x-hidden pt-30 pb-50`}>
      <BGBlob src={"/images/bg-blob.webp"} />
      <InfoList type="about" />
      <h1 className={`${font_accent.className} heading`} id="assortment">
        У нас на полках
      </h1>
      <InfoList type={"assortment"} limit={3} />
    </main>
  );
}
