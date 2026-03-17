import BGBlob from "@/components/UI/bg-blob";
import { useCloudPath } from "@/lib/cloud";
import { pool } from "@/lib/db";
import NoInfo from "@/components/no-info";
import CategoryItem from "@/components/list-items/category-item";

export default async function CategoriesPage() {
  const cloudPath = await useCloudPath();
  const data = await pool.query("SELECT * FROM categories ORDER BY name ASC");
  if (!data || data.rows.length === 0) return <NoInfo />;

  return (
    <main area-label="категории" className={`w-full overflow-x-hidden`}>
      <BGBlob src={"/images/bg-blob.webp"} />
      <div
        aria-label="категории"
        className="w-full flex flex-col lg:flex-row justify-center lg:flex-wrap gap-10 x-spacing"
      >
        {data.rows.map((item) => (
          <CategoryItem key={item.id} category={item} cloudPath={cloudPath} />
        ))}
      </div>
    </main>
  );
}
