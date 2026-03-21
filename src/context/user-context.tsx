'use client';

import { createContext, useContext } from 'react';
import type { User, Address } from '@/lib/types';

export const UserContext = createContext<{
    general: User,
    addresses: Address[],
} | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
