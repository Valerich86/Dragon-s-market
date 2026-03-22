'use client';

import { ProfileContext } from '@/context/profile-context';
import { Address, User } from '@/lib/types';
import type { ReactNode } from 'react';

interface ProviderProps {
  user: {
    general: User;
    addresses: Address[];
  };
  children: ReactNode;
}

export default function ProfileProvider({ user, children }: ProviderProps) {
  return (
    <ProfileContext.Provider value={user}>
      {children}
    </ProfileContext.Provider>
  );
}
