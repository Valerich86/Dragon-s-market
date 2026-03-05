import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "Драконий базар | Каталог | %s",
    default: "Каталог",
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

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pb-50">
      {children}
    </div>
  );
}
