'use client'

import { EventPayload, useSubscription } from '@/components/subscribe-provider';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const RefreshOnStatusChange = ({ children }: { children?: ReactNode }) => {
    const router = useRouter();
    useSubscription((payload: EventPayload) => {
        if (payload.namespace === 'sdk' &&
            (payload.eventType === 'sdk-online' ||
                payload.eventType === 'sdk-offline'))
            router.refresh();
    });
    return <>{children}</>;
}

export default RefreshOnStatusChange;
