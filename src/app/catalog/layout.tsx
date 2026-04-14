import CatalogProvider from "@/components/catalog-provider";
import CategoriesList from "@/components/sections/categories-list";
import SearchInput from "@/components/UI/search-input";
import { getCategories, getCatalog } from "@/lib/actions";
import { font_light } from "@/lib/fonts";
import type { Metadata } from "next";
import { verifySession } from "@/lib/auth";
import UserIdProvider from "@/components/userId-provider";
import { useCloudPath } from "@/lib/cloud";
import MascotCookie from "@/components/mascot-cookie";

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
  const session = await verifySession();
  let userId = 0;
  if (session) userId = session.userId;
  const { categories } = await getCategories();
  const { catalog } = await getCatalog(userId, 0);
  const cloudPath = useCloudPath();
  const randomIndex = Math.floor(Math.random() * catalog.length);
  // const newMascotPositionId = catalog[randomIndex].id;
  const newMascotPositionId = 717;

  return (
    <main
      aria-label="каталог"
      className={`w-full overflow-x-hidden x-spacing py-30`}
    >
      <UserIdProvider userId={userId}>
        <MascotCookie newMascotPositionId={newMascotPositionId} />
        <section aria-label="категории" className="w-full flex flex-wrap gap-5">
          <div className="w-full flex justify-between items-center h-10">
            <h1 className={`${font_light.className} uppercase`}>Каталог</h1>
            <SearchInput allProducts={catalog} cloudPath={cloudPath} />
          </div>
          <CategoriesList categories={categories} />
        </section>
        <CatalogProvider
          catalog={{ allProducts: catalog, cloudPath: cloudPath }}
        >
          {children}
        </CatalogProvider>
      </UserIdProvider>
    </main>
  );
}
