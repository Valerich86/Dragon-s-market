import { Metadata, ResolvingMetadata } from "next";
import { useCloudPath } from "@/lib/cloud";
import ProductSection from "@/components/sections/product";
import { getProductData } from "@/lib/server-data";
import { verifySession } from "@/lib/auth";

export async function generateMetadata(
  {
    searchParams,
  }: {
    searchParams: Promise<{ productName: string; categoryName: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { productName, categoryName } = await searchParams;
  let product = "Неизвестный товар",
    category;
  if (productName) {
    product = decodeURIComponent(productName);
  }
  if (category) {
    category = decodeURIComponent(categoryName);
  }
  const title = category ? `${category} | ${product}` : product;
  const description = `Купить "${product}" в магазине азиатских снеков "Драконий базар", Пермь`;
  return {
    title,
    description,
    keywords: [product, "азиатские снеки", "купить", "Драконий базар"],
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  let userId = 0;
  const session = await verifySession();
  if (session) userId = session.userId;
  const { id } = await params;
  const cloudPath = useCloudPath();
  const { product } = await getProductData(id, userId);

  if (!product)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Товар не найден
      </div>
    );

  return (
    <main
      aria-label="товар"
      className={`w-full overflow-x-hidden x-spacing flex justify-center items-center`}
    >
      <ProductSection product={product} cloudPath={cloudPath} userId={userId} />
    </main>
  );
}
