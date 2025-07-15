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

export const useCachedImage = (url: string | null | undefined) => {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (!url) return;

        const key = `cached-image:${url}`;
        const cached = sessionStorage.getItem(key);

        if (cached) {
            setImage(cached);
            return;
        }

        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    sessionStorage.setItem(key, base64);
                    setImage(base64);
                }
                reader.readAsDataURL(blob);
            })
            .catch(err => console.error('Error caching image:', err));
    }, [url]);

    return image;
}

export function useSessionState<T>(key: string, defaultValue: T) {
    const [state, setState] = useState<T>(() => {
        if (typeof window === 'undefined') return defaultValue
        try {
            const stored = sessionStorage.getItem(key)
            return stored ? JSON.parse(stored) as T : defaultValue
        } catch {
            return defaultValue
        }
    })

    useEffect(() => {
        try {
            sessionStorage.setItem(key, JSON.stringify(state))
        } catch {
            // Ignore write errors (e.g. storage quota)
        }
    }, [key, state])

    return [state, setState] as const
}
