'use client'

import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { io, Socket } from 'socket.io-client';

export type EventPayload = {
    namespace: string,
    eventType: string,
    entityType: string,
    timestamp: string,
    id: string
}

type SubscriberContextType = {
    subscribe: (fn: (e: EventPayload) => void) => () => void; // returns unsubscribe fn
};

const SubscriberContext = createContext<SubscriberContextType | undefined>(undefined);

const useSubscriber = () => {
    const context = useContext(SubscriberContext);
    if (!context) throw new Error('useSubscriber must be used within SubscriberProvider');
    return context;
};

export const useSubscription = (fn: (e: EventPayload) => void) => {
    const { subscribe } = useSubscriber();
    useEffect(() => {
        const unsubscribe = subscribe(fn);
        return unsubscribe;
    }, [subscribe, fn])
}

const SubscribeProvider = ({ children, token }: { children?: ReactNode, token: string }) => {
    const socketRef = useRef<Socket | null>(null);
    const listenersRef = useRef(new Set<(e: EventPayload) => void>());

    useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_PUBLISHER_URL, {
            auth: { token: token }
        });

        socketRef.current = socket;

        socket.on('event', (payload: EventPayload) => {
            // Call all registered listeners with the event payload
            console.log('event recieved', listenersRef.current)
            listenersRef.current.forEach((listener) => {
                listener(payload);
            });
        });

        return () => { socket.disconnect(); };
    }, [token]);

    const subscribe = (fn: (e: EventPayload) => void) => {
        listenersRef.current.add(fn);
        console.log(listenersRef.current);
        // Return unsubscribe function
        return () => {
            listenersRef.current.delete(fn);
        };
    };

    return (
        <SubscriberContext.Provider value={{ subscribe }}>
            {children}
        </SubscriberContext.Provider>
    )
}

export default SubscribeProvider;
