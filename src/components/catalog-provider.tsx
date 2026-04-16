"use client";

import { CatalogContext } from "@/context/catalog-context";
import type { ReactNode } from "react";
import type { Category, Product } from "@/lib/types";

interface ProviderProps {
  catalog: {allProducts:Product[], cloudPath: string, showMascot: boolean, mascotPositionId: number},
  children: ReactNode;
}

export default function CatalogProvider({ catalog, children }: ProviderProps) {
  return (
    <CatalogContext.Provider value={catalog}>
      {children}
    </CatalogContext.Provider>
  );
}
