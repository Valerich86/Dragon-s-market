import BGBlob from "@/components/UI/bg-blob";
import CategoriesList from "@/components/lists/categories";

export default async function CategoriesPage() {
  return (
    <main area-label="категории" className={`w-full overflow-x-hidden pt-30 pb-50`}>
      <BGBlob src={"/images/bg-blob.webp"} />
      <CategoriesList />
    </main>
  );
}
