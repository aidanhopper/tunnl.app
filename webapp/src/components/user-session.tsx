'use client'

import { UserProvider } from "@/components/session-provider";
import { useLocalSession } from "@/lib/hooks";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export const ValidateUserSession = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { data, status } = useLocalSession();

    useEffect(() => {
        if (status === 'unauthenticated') router.replace('/login');
    }, [status, router]);

    return data ? (
        <>
            {children}
        </>
    ) : <></>
}

export const UserSession = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    );
}
