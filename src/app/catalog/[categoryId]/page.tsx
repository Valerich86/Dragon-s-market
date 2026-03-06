import { Metadata, ResolvingMetadata } from "next";
import BGBlob from "@/components/UI/bg-blob";
import ProductsList from "@/components/lists/products";

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ categoryId: string }>;
    searchParams: Promise<{ categoryName: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // Разворачиваем searchParams с помощью await
  const {categoryName} = await searchParams;

  let category = "Неизвестная категория";
  if (categoryName) {
    category = decodeURIComponent(categoryName);
  }

  const title = `${category}`;
  const description = `Купить ${category.toLowerCase()} в магазине азиатских снеков "Драконий базар", Пермь`;

  return {
    title,
    description,
    keywords: [category, "азиатские снеки", "купить", "Драконий базар"],
  };
}

export default async function CategoryProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{ categoryName: string }>;
}) {
  const { categoryId } = await params;
  const { categoryName } = await searchParams;

  return (
    <main area-label="категории" className={`w-full overflow-x-hidden`}>
      <h1 className="x-spacing text-center mb-10">Товары категории "{categoryName}"</h1>
      <BGBlob src={"/images/bg-blob.webp"} />
      <ProductsList categoryId={categoryId} categoryName={categoryName}/>
    </main>
  );
}
