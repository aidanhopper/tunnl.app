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
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Separator } from '@/components/ui/separator';

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

    if (!process.env.PUBLISHER_URL) return <>Error</>;

    return (
        <DashboardLayout>
            <SubscribeProvider url={process.env.PUBLISHER_URL} token={token}>
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
                                <div className='flex flex-col gap-10'>
                                    {!isExpired ?
                                        <div className='flex items-center'>
                                            <div className='flex-1'>
                                                <span className='font-bold'>Enrollment expires</span>:
                                                <span className='ml-2'>
                                                    {expires ? ` ${(new Date(expires)).toLocaleString()}` : null}
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
                                    <div className='mx-auto max-w-2xl'>
                                        <h3 className='text-3xl font-bold'>How to enroll your device</h3>
                                        <Separator className='mt-3' />
                                        <ol className="mt-4 list-decimal ml-5 text-lg space-y-6">
                                            <li>
                                                If you don’t have a Ziti Tunneler, click the <strong>Download Tunneler</strong> button
                                                to view instructions for downloading one for your platform.
                                            </li>

                                            <li className="space-y-4">
                                                <p>
                                                    Once you have your Ziti Tunneler, click the <strong>Enroll</strong> button to see the
                                                    available enrollment options. You will see three choices:
                                                </p>
                                                <ul className="list-disc ml-5 space-y-1">
                                                    <li><strong>QR Code</strong> – Scan with a Ziti Mobile Edge app</li>
                                                    <li><strong>Download JWT File</strong> – Save a file containing your enrollment token,
                                                        best for enrolling with a Ziti Destop Edge for Windows or MacOS Application</li>
                                                    <li><strong>Copy Token</strong> – Copy the token to your clipboard,
                                                        best for enrolling the Linux Ziti Edge Tunneler service or with Docker</li>
                                                </ul>
                                                <p>
                                                    Pick the best enrollment method for the device you want to enroll.
                                                </p>
                                                <p>
                                                    All three methods work for enrolling in a Tunneler application—the end result is
                                                    the same: your identity is enrolled into the Tunnl.app network.
                                                </p>
                                                <p>
                                                    <i>Note: Generally an identity corresponds to a device (Phone, PC, etc.).</i>
                                                </p>
                                            </li>

                                            <li>
                                                Using your chosen enrollment method, enroll the identity into the Tunnl.app network.
                                            </li>
                                        </ol>
                                    </div>
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
