import BGBlob from "@/components/UI/bg-blob";
import { Metadata } from "next";
import { useCloudPath } from "@/lib/cloud";
import { pool } from "@/lib/db";
import NoInfo from "@/components/no-info";
import InfoItem from "@/components/list-items/info-item";

export const metadata: Metadata = {
  title: "Новости",
  description: 'Новости и конкурсы магазина "Драконий базар", Пермь',
  keywords: ["азиатские снеки", "конкурсы", "новости", "Драконий базар"],
};

export default async function NewssPage() {
  const cloudPath = await useCloudPath();
  const data = await pool.query(
    `SELECT * FROM info WHERE info_type = 'news' ORDER BY created_at DESC`,
  );

  if (!data || data.rows.length === 0) return <NoInfo />;

  return (
    <main
      area-label="новости"
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
