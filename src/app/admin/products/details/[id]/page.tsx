import { useCloudPath } from "@/lib/cloud";
import { getProductData } from "@/lib/actions";
import ProductForm from "@/components/forms/product";
import { font_bold, font_light } from "@/lib/fonts";
import ProductImage from "@/components/UI/product-image";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const cloudPath = useCloudPath();
  const { product } = await getProductData(id, 0);

  if (!product)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Товар не найден
      </div>
    );

  return (
    <div className="w-full px-5 flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2">
        <h1 className={`${font_light.className} uppercase my-5 underline underline-offset-6`}>
          ID: {product.id}
        </h1>
        <h2 className={`${font_bold.className} text-lg mb-4`}>
          {product.name}
        </h2>
        <p className="text-xs">
          Цена за {product.weight} {product.unit}:{" "}
          <strong className="text-lg">{product.price} ₽</strong>
        </p>
        <p className="text-xs">
          ID категории:{" "}
          <strong className="text-lg">{product.category_id} </strong>
        </p>
        <p className="text-xs">
          Остаток в БД:{" "}
          <strong className="text-lg">
            {product.remains} {product.unit}
          </strong>
        </p>
        <ProductForm product={product} cloudPath={cloudPath} />
      </div>
      <div className="w-full lg:w-1/2">
        <ProductImage productId={product.id} cloudPath={cloudPath} />
      </div>
    </div>
  );
}
