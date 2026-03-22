'use client';

import { createContext, useContext } from 'react';
import type { User, Address } from '@/lib/types';

export const ProfileContext = createContext<{
    general: User,
    addresses: Address[],
} | null>(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
