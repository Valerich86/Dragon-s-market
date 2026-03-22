'use client';

import { createContext, useContext } from 'react';
import type { Category, Product } from '@/lib/types';

export const CatalogContext = createContext<{
    categories: Category[];
    products: Product[];
    cloudPath: string;
} | null>(null);

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
