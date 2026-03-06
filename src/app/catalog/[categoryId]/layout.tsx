import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "Драконий базар | Каталог | %s",
    default: "Драконий базар",
  },
  description: "Драконий базар. Магазин азиатских снеков, город Пермь",
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="">
        {children}
      </div>
  );
}
