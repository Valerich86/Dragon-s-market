import { Metadata, ResolvingMetadata } from "next";
import BGBlob from "@/components/UI/bg-blob";
import { pool } from "@/lib/db";
import { useCloudPath } from "@/lib/cloud";
import ProductImage from "@/components/UI/product-image";
import CustomButton from "@/components/UI/custom-button";
import { font_accent } from "@/lib/fonts";
import ProductSection from "@/components/sections/product";

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ productId: string }>;
    searchParams: Promise<{ productName: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { productName } = await searchParams;
  let product = "Неизвестный товар";
  if (productName) {
    product = decodeURIComponent(productName);
  }
  const title = product;
  const description = `Купить ${product.toLowerCase()} в магазине азиатских снеков "Драконий базар", Пермь`;
  return {
    title,
    description,
    keywords: [product, "азиатские снеки", "купить", "Драконий базар"],
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const cloudPath = await useCloudPath();
  const data = await pool.query(`SELECT * FROM products WHERE id=$1`, [
    productId,
  ]);
  const product = data.rows[0];

  if (!product)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Товар не найден
      </div>
    );

  return (
    <main aria-label="товар" className={`w-full overflow-x-hidden z-50`}>
      <BGBlob src={"/images/bg-blob.webp"} />
      <ProductSection product={product} cloudPath={cloudPath} />
    </main>
  );
}
