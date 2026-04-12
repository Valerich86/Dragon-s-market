// context/userId-context.ts
'use client';

import { createContext, useContext } from 'react';

export const UserIdContext = createContext<number | null>(null);

export const useUserId = () => {
  const context = useContext(UserIdContext);

  return context;
};
