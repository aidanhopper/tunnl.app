'use client'

import { UserProvider } from "@/components/session-provider";
import { useLocalSession } from "@/lib/hooks";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

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
    ) : <div className='flex flex-col gap-5'>
        <Skeleton className='w-96 h-16' />
        <Skeleton className='w-full h-96' />
        <div className='grid grid-cols-3 gap-5'>
            <Skeleton className='h-32' />
            <Skeleton className='h-32' />
            <Skeleton className='h-32' />
        </div>
    </div>
}

export const UserSession = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserProvider>
            {children}
        </UserProvider>
    );
}
