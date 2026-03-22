import { Metadata, ResolvingMetadata } from "next";
import ProductsList from "@/components/sections/products-list";

export async function generateMetadata(
  {
    searchParams,
  }: {
    searchParams: Promise<{ categoryName: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { categoryName } = await searchParams;
  let category = "";
  if (categoryName) {
    category = decodeURIComponent(categoryName);
  }
  const title = category;
  const description = `Купить товары категрии "${category.toLowerCase()}" в магазине азиатских снеков "Драконий базар", Пермь`;
  return {
    title,
    description,
    keywords: [category, "азиатские снеки", "купить", "Драконий базар"],
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ categoryId: number }>;
  searchParams: Promise<{ categoryName: string }>;
}) {
  const { categoryId } = await params;
  const { categoryName } = await searchParams;
  return (
    <main
      aria-label={categoryName}
      className="w-full flex flex-wrap gap-4 items-center justify-between py-15"
    >
      <ProductsList category={{id: categoryId, name: categoryName}}/>
    </main>
  );
}
