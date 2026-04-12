// context/CartContext.ts
'use client';

import { createContext, useState } from 'react';

interface CartContextType {
  refreshCart: boolean;
  setRefreshCart: (value: boolean) => void;
}

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [refreshCart, setRefreshCart] = useState(false);

  return (
    <CartContext.Provider value={{ refreshCart, setRefreshCart }}>
      {children}
    </CartContext.Provider>
  );
}
