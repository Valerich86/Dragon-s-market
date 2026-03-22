import CatalogProvider from "@/components/catalog-provider";
import CategoriesList from "@/components/sections/categories-list";
import SearchInput from "@/components/UI/search-input";
import { getAllProductsAndCategoriesForCatalog } from "@/lib/actions";
import { font_light } from "@/lib/fonts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "Драконий базар | Каталог | %s",
    default: "Каталог | Все",
  },
  description:
    'Выберите категорию азиатских снеков и сладостей в магазине "Драконий базар", Пермь',
  keywords: [
    "азиатские снеки",
    "каталог",
    "категории товаров",
    "Драконий базар",
  ],
};

export default async function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { catalog } = await getAllProductsAndCategoriesForCatalog();

  return (
    <main
      aria-label="каталог"
      className={`w-full overflow-x-hidden x-spacing py-30`}
    >
      <section aria-label="категории" className="w-full flex flex-wrap gap-5">
        <div className="w-full flex justify-between items-center h-10">
          <h1 className={`${font_light.className} uppercase`}>Каталог</h1>
          <SearchInput
            allProducts={catalog.products}
            cloudPath={catalog.cloudPath}
          />
        </div>
        <CategoriesList categories={catalog.categories} />
      </section>
      <CatalogProvider catalog={catalog}>{children}</CatalogProvider>
    </main>
  );
}
