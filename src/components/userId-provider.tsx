'use client';

import { UserIdContext } from '@/context/userId-context';
import type { ReactNode } from 'react';

interface ProviderProps {
  userId: number;
  children: ReactNode;
}

export default function UserIdProvider({ userId, children }: ProviderProps) {
  return (
    <UserIdContext.Provider value={userId}>
      {children}
    </UserIdContext.Provider>
  );
}
