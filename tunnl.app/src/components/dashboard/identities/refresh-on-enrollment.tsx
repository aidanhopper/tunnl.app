'use client'

import { EventPayload, useSubscription } from '@/components/subscribe-provider';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const RefreshOnEnrollment = ({ children }: { children?: ReactNode }) => {
    const router = useRouter();
    useSubscription((payload: EventPayload) => {
        if (payload.entityType === 'enrollments'
            && payload.eventType === 'deleted')
            router.refresh();
    });
    return <>{children}</>;
}

export default RefreshOnEnrollment;
