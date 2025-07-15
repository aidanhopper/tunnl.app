'use client'

import { EventPayload, useSubscription } from '@/components/subscribe-provider';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const RefreshOnEvent = ({ children, onEvent }: { children?: ReactNode, onEvent: (payload: EventPayload) => Promise<boolean> }) => {
    const router = useRouter();
    useSubscription(async (payload: EventPayload) => {
        if (await onEvent(payload)) router.refresh();
    });
    return <>{children}</>;
}

export default RefreshOnEvent;
