import { Metadata, ResolvingMetadata } from "next";
import ProductsList from "@/components/sections/products-list";
import { getCatalog } from "@/lib/server-data";
import { verifySession } from "@/lib/auth";

export async function generateMetadata(
  {searchParams}:{searchParams: Promise<{ categoryName: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { categoryName } = await searchParams;
  let category = "";
  if (categoryName) {category = decodeURIComponent(categoryName)}
  const title = category;
  const description = `Купить товары категрии "${category.toLowerCase()}" в магазине азиатских снеков "Драконий базар", Пермь`;
  return {
    title,
    description,
    keywords: [category, "азиатские снеки", "купить", "Драконий базар"],
  };
}

export default async function CategoryPage({params, searchParams}: {
  params: Promise<{ categoryId: number }>;
  searchParams: Promise<{ categoryName: string }>;
}) {
  const { categoryId } = await params;
  const { categoryName } = await searchParams;
  const session = await verifySession();
  let userId = 0;
  if (session) userId = session.userId;
  const { catalog } = await getCatalog(userId, categoryId);

  return (
    <>
      {Number(categoryId) === 4 && (
        <div className={
          `mt-12 p-4 bg-yellow-50 border text-center 
          border-yellow-200 rounded-lg text-xs text-yellow-800`
        }>
          <strong>Важно:</strong> энергетики можно добавить в корзину только при
          условии самовывоза — доставка этой категории товаров не предусмотрена.
        </div>
      )}
      <section
        aria-label={categoryName}
        className="w-full flex flex-wrap gap-5 items-center justify-between py-15"
      >
        <ProductsList products={catalog} categoryName={categoryName} />
      </section>
    </>
  );
}
