'use client';

import { CatalogContext } from '@/context/catalog-context';
import type { ReactNode } from 'react';
import type { Category, Product } from '@/lib/types';

interface ProviderProps {
  catalog: {
    categories: Category[];
    products: Product[];
    cloudPath: string;
  };
  children: ReactNode;
}

export default function CatalogProvider({ catalog, children }: ProviderProps) {
  return (
    <CatalogContext.Provider value={catalog}>
      {children}
    </CatalogContext.Provider>
  );
}
