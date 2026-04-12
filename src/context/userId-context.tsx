// context/userId-context.ts
'use client';

import { createContext, useContext } from 'react';

export const UserIdContext = createContext<number | null>(null);

export const useUserId = () => {
  const context = useContext(UserIdContext);

  if (typeof window === 'undefined') {
    return 0; // На сервере возвращаем null
  }

  if (context === null) {
    console.warn('useUserId used outside UserIdProvider');
    return 0;
  }

  return context;
};
