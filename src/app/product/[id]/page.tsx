import { Metadata, ResolvingMetadata } from "next";
import BGBlob from "@/components/UI/bg-blob";
import { pool } from "@/lib/db";
import { useCloudPath } from "@/lib/cloud";
import ProductImage from "@/components/UI/product-image";
import CustomButton from "@/components/UI/custom-button";
import { font_accent } from "@/lib/fonts";
import ProductSection from "@/components/sections/product";
import { getProductData } from "@/lib/actions";

export async function generateMetadata(
  {
    searchParams,
  }: {
    searchParams: Promise<{ productName: string, categoryName: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { productName, categoryName } = await searchParams;
  let product = "Неизвестный товар", category;
  if (productName) {
    product = decodeURIComponent(productName);
  }
  if (category) {
    category = decodeURIComponent(categoryName);
  }
  const title = category ? `${category} | ${product}`: product;
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
  const { id } = await params;
  const cloudPath = useCloudPath();
  const {product} = await getProductData(id);

  if (!product)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Товар не найден
      </div>
    );

  return (
    <main aria-label="товар" className={`w-full h-screen overflow-x-hidden x-spacing flex justify-center items-center`}>
      <ProductSection product={product} cloudPath={cloudPath} />
    </main>
  );
}
