'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";

const LOCAL_SESSION_KEY = 'local session';

interface SessionUser {
    name?: string | null
    email?: string | null
    image?: string | null
}

interface LocalSession {
    user?: SessionUser
    expires?: string
}

export const useLocalSession = () => {
    const { data, status } = useSession();
    const [localSession, setLocalSession] = useState<LocalSession | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
        const stored = localStorage.getItem(LOCAL_SESSION_KEY);
        if (stored) {
            try {
                setLocalSession(JSON.parse(stored));
            } catch {
                localStorage.removeItem(LOCAL_SESSION_KEY);
            }
        }
    }, []);

    useEffect(() => {
        if (status === 'authenticated' && data) {
            localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(data));
            setLocalSession(data);
        }

        if (status === 'unauthenticated') {
            localStorage.removeItem(LOCAL_SESSION_KEY);
            setLocalSession(null);
        }
    }, [status, data]);

    return {
        data: hydrated ? localSession : null,
        status,
    };
}

export const clearLocalSession = () => {
    localStorage.removeItem(LOCAL_SESSION_KEY);
}
