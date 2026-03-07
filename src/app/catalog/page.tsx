import BGBlob from "@/components/UI/bg-blob";
import CategoriesList from "@/components/lists/categories";
import { useCloudPath } from "@/lib/cloud";

export default async function CategoriesPage() {
  const cloudPath = await useCloudPath();

  return (
    <main area-label="категории" className={`w-full overflow-x-hidden`}>
      <BGBlob src={"/images/bg-blob.webp"} />
      <CategoriesList cloudPath={cloudPath}/>
    </main>
  );
}
