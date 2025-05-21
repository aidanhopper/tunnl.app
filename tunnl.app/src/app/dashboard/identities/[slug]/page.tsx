import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { getIdentityBySlug } from '@/db/types/identities.queries';
import { getUserByEmail } from '@/db/types/users.queries';
import client from '@/lib/db';
import { Monitor } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { notFound, forbidden, unauthorized } from 'next/navigation';
import * as ziti from '@/lib/ziti/identities';
import EnrollIdentityDialog from '@/components/dashboard/identities/enroll-identity-dialog';
import ResetIdentityEnrollmentButton from '@/components/dashboard/identities/reset-identity-enrollment-button';
import SubscribeProvider from '@/components/subscribe-provider';
import generateToken from '@/lib/subscribe/generate-token';
import IdentityStatusCard from '@/components/dashboard/identities/identity-status-card';
import RefreshOnEvent from '@/components/dashboard/refresh-on-event';

const Identity = async ({ params }: { params: { slug: string } }) => {
    const slug = params.slug;

    const session = await getServerSession();

    if (!session?.user?.email) unauthorized();

    const email = session.user.email;

    const identity = (await getIdentityBySlug.run(
        {
            slug: slug
        },
        client
    ))[0];

    if (!identity) notFound();

    const user = (await getUserByEmail.run(
        {
            email: email
        },
        client
    ))[0];

    if (user.id !== identity.user_id) forbidden();

    const zitiIdentity = await ziti.getIdentityByName(slug);

    if (!zitiIdentity) notFound();

    const expires = zitiIdentity.enrollment.ott?.expiresAt;
    const isExpired = expires ? new Date(expires) <= new Date() : null;

    const token = generateToken({
        topics: [
            zitiIdentity.id,
            zitiIdentity.enrollment.ott ?? ''
        ]
    });

    return (
        <DashboardLayout>
            <SubscribeProvider token={token}>
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
                                <h1>{identity.name}</h1>
                            </div>
                        </div>
                        <div className='mt-12'>
                            {zitiIdentity?.enrollment.ott?.jwt ?
                                <div>
                                    {!isExpired ?
                                        <div className='flex items-center'>
                                            <div className='flex-1'>
                                                <span className='font-bold'>Enrollment expires</span>:
                                                <span className='ml-2'>
                                                    {expires ? (new Date(expires)).toLocaleString() : null}
                                                </span>
                                            </div>
                                            <div className='flex justify-end'>
                                                <EnrollIdentityDialog
                                                    fileName={`${slug}.jwt`}
                                                    value={zitiIdentity.enrollment.ott.jwt} />
                                            </div>
                                        </div> : <div className='flex items-center'>
                                            <div className='font-bold flex-1'>
                                                Enrollment expired
                                            </div>
                                            <div className='flex justify-end'>
                                                <ResetIdentityEnrollmentButton name={slug} />
                                            </div>
                                        </div>}
                                </div> :
                                <div className='grid gap-12'>
                                    <div>
                                        <ResetIdentityEnrollmentButton name={slug} />
                                    </div>
                                    <IdentityStatusCard identity={identity} />
                                </div>}
                        </div>
                    </RefreshOnEvent>
                </RefreshOnEvent>
            </SubscribeProvider>
        </DashboardLayout >
    );
}

export default Identity;
