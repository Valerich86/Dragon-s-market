import { Metadata, ResolvingMetadata } from "next";
import BGBlob from "@/components/UI/bg-blob";
import ProductsList from "@/components/lists/products";
import ProductItem from "@/components/items/product-item";

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ productId: string }>;
    searchParams: Promise<{ categoryName: string, productName: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // Разворачиваем searchParams с помощью await
  const {categoryName, productName} = await searchParams;

  let product = "Неизвестный товар";
  if (productName) {
    product = decodeURIComponent(productName);
  }
  let category = "Неизвестная категория";
  if (categoryName) {
    category = decodeURIComponent(categoryName);
  }

  const title = `${category} | ${product}`;
  const description = `Купить ${product.toLowerCase()} в магазине азиатских снеков "Драконий базар", Пермь`;

  return {
    title,
    description,
    keywords: [product, "азиатские снеки", "купить", "Драконий базар"],
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ name: string }>;
}) {
  const { productId } = await params;

  return (
    <main area-label="товар" className={`w-full overflow-x-hidden z-50`}>
      <BGBlob src={"/images/bg-blob.webp"} />
      <ProductItem id={productId} />
    </main>
  );
}
