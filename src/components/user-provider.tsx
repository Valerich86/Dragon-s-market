// components/UserProvider.tsx
'use client';

import { UserContext } from '@/context/user-context';
import { Address, User } from '@/lib/types';
import type { ReactNode } from 'react';

interface UserProviderProps {
  user: {
    general: User;
    addresses: Address[];
  };
  children: ReactNode;
}

export default function UserProvider({ user, children }: UserProviderProps) {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}
