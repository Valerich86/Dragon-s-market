'use client';

import { createContext, useContext } from 'react';

export const UserIdContext = createContext<number | null>(null);

export const useUserId = () => {
  const context = useContext(UserIdContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
