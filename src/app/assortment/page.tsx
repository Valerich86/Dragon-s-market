import BGBlob from "@/components/UI/bg-blob";
import { Metadata } from "next";
import { useCloudPath } from "@/lib/cloud";
import { pool } from "@/lib/db";
import NoInfo from "@/components/no-info";
import InfoItem from "@/components/cards/info-item";

export const metadata: Metadata = {
  title: "О товарах",
  description: 'Ассортимент магазина "Драконий базар", Пермь',
  keywords: ["азиатские снеки", "ассортимент", "Драконий базар"],
};

export default async function AssortmentPage() {
  const cloudPath = await useCloudPath();
  const data = await pool.query(
    `SELECT * FROM info WHERE info_type = 'assortment' ORDER BY created_at DESC`,
  );

  if (!data || data.rows.length === 0) return <NoInfo />;

  return (
    <main
      area-label="о товарах"
      className={`w-full overflow-x-hidden pt-30 pb-50`}
    >
      <BGBlob src={"/images/bg-blob.webp"} />
      <div className="w-full flex flex-col justify-center items-center gap-10 md:gap-0">
        {data.rows.map((item) => (
          <InfoItem key={item.id} item={item} cloudPath={cloudPath} />
        ))}
      </div>
    </main>
  );
}
