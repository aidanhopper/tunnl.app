import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Monitor } from 'lucide-react';
import EnrollIdentityDialog from '@/components/dashboard/identities/enroll-identity-dialog';
import SubscribeProvider from '@/components/subscribe-provider';
import generateToken from '@/lib/subscribe/generate-token';
import IdentityStatusCard from '@/components/dashboard/identities/identity-status-card';
import RefreshOnEvent from '@/components/dashboard/refresh-on-event';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserManager } from '@/lib/models/user';
import pool from '@/lib/db';
import { notFound, unauthorized } from 'next/navigation';

const Identity = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;
    const user = await new UserManager(pool).auth() || unauthorized();
    const identity = await user.getIdentityManager().getIdentityBySlug(slug) || notFound();

    const enrollment = await identity.getEnrollment();
    const expires = enrollment?.ott?.expiresAt;
    const isExpired = expires ? new Date(expires) <= new Date() : null;

    const token = generateToken({
        topics: [
            identity.getZitiId(),
            enrollment?.ott ?? ''
        ]
    });

    if (!process.env.NEXT_PUBLIC_PUBLISHER_URL) return <>Error</>;

    return (
        <DashboardLayout>
            <SubscribeProvider url={process.env.NEXT_PUBLIC_PUBLISHER_URL} token={token}>
                <RefreshOnEvent onEvent={async (payload) => {
                    'use server'
                    return payload.entityType === 'enrollments' && payload.eventType === 'deleted'
                }}>
                    <RefreshOnEvent onEvent={async (payload) => {
                        'use server'
                        return payload.namespace === 'sdk'
                            && (payload.eventType === 'sdk-online'
                                || payload.eventType === 'sdk-offline')
                    }}>
                        <div className='flex'>
                            <div className='flex flex-1 items-center gap-8'>
                                <Monitor size={48} />
                                <h1>{identity.getName()}</h1>
                            </div>
                        </div>
                        <div className='mt-12'>
                            {enrollment?.ott?.jwt ?
                                <div>
                                    {!isExpired ?
                                        <div className='flex items-center'>
                                            <div className='flex-1'>
                                                <span className='font-bold'>Enrollment expires</span>:
                                                <span className='ml-2'>
                                                    {expires ? (new Date(expires)).toLocaleString() : null}
                                                </span>
                                            </div>
                                            <div className='flex justify-end gap-8'>
                                                <Button variant='secondary' asChild>
                                                    <Link href='/download'>
                                                        Download Tunneler
                                                    </Link>
                                                </Button>
                                                <EnrollIdentityDialog
                                                    fileName={`${slug}.jwt`}
                                                    value={enrollment.ott.jwt} />
                                            </div>
                                        </div> : <div className='flex items-center'>
                                            <div className='font-bold flex-1'>
                                                Enrollment expired
                                            </div>
                                            {/* <div className='flex justify-end'> */}
                                            {/*     <ResetIdentityEnrollmentButton name={slug} /> */}
                                            {/* </div> */}
                                        </div>}
                                </div> :
                                <div className='grid gap-12'>
                                    {/* <div> */}
                                    {/*     <ResetIdentityEnrollmentButton name={slug} /> */}
                                    {/* </div> */}
                                    <IdentityStatusCard identity={identity.getClientData()} />
                                </div>}
                        </div>
                    </RefreshOnEvent>
                </RefreshOnEvent>
            </SubscribeProvider>
        </DashboardLayout >
    );
}

export default Identity;
