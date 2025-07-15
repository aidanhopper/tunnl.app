'use client';

import { SessionProvider } from 'next-auth/react';

export function UserProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
