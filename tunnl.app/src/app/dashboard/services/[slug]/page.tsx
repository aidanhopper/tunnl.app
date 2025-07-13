import AreYouSure from "@/components/are-you-sure";
import { AreYouSureProvider } from "@/components/are-you-sure-provider";
import RevokeButton from "@/components/dashboard/services/revoke-button";
import RevokeDropdownMenuItem from "@/components/dashboard/services/revoke-dropdown-menu-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getServiceBySlug } from "@/db/types/services.queries";
import { getServiceShareLinks } from "@/db/types/share_links.queries";
import { getSharesByServiceSlug } from "@/db/types/shares.queries";
import { getTunnelBindingsByServiceSlug, IGetTunnelBindingsByServiceSlugResult } from "@/db/types/tunnel_bindings.queries";
import deleteShareLink from "@/lib/actions/shares/delete-share-link";
import deleteShare from "@/lib/actions/shares/delete-share";
import revokeAllShareLinks from "@/lib/actions/shares/revoke-all-share-links";
import revokeAllShares from "@/lib/actions/shares/revoke-all-shares";
import client from "@/lib/db";
import { ArrowDown, EllipsisVertical } from "lucide-react";
import { notFound } from "next/navigation";
import DialChart from "@/components/dashboard/services/dial-chart";
import { getServiceDialsByServiceId } from "@/db/types/service_dials.queries";
import Link from "next/link";
import disableService from "@/lib/actions/services/disable-service";
import enableService from "@/lib/actions/services/enable-service";

const ServiceGeneral = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;

    const serviceList = await getServiceBySlug.run({ slug: slug }, client);
    if (serviceList.length === 0) notFound();
    const service = serviceList[0];

    const shares = await getSharesByServiceSlug.run({ slug: slug }, client);
    const shareLinks = (await getServiceShareLinks.run({ slug: slug }, client))
        .filter(e => e.expires > new Date());

    let tunnelBinding: IGetTunnelBindingsByServiceSlugResult | null = null;
    const tunnelBindingList = await getTunnelBindingsByServiceSlug.run({ slug: slug }, client);
    if (tunnelBindingList.length !== 0) tunnelBinding = tunnelBindingList[0];

    const serviceDials = await getServiceDialsByServiceId.run({ service_id: service.id }, client);

    return (
        <>
            {tunnelBinding ? <div className='flex flex-col gap-4'>
                <Card>
                    <CardHeader>
                        <CardTitle>Usage for the last 24hrs</CardTitle>
                        <CardDescription>
                            Displays the number of successful dials on the Y axis for that time period
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DialChart serviceDials={serviceDials} />
                    </CardContent>
                </Card>
                <div className='grid lg:grid-cols-2 gap-4'>
                    <Card>
                        <CardHeader className='grid grid-cols-3 items-center'>
                            <CardTitle className='col-span-2'>
                                Active shares ({shares.length})
                            </CardTitle>
                            <AreYouSureProvider>
                                <AreYouSure
                                    yesText=<>Revoke all shares</>
                                    refreshOnYes={true}
                                    onClickYes={async () => {
                                        'use server'
                                        await revokeAllShares(service.id);
                                    }}>
                                    Are you sure you want to revoke all {service.name} shares?
                                </AreYouSure>
                                <RevokeButton>
                                    Revoke all
                                </RevokeButton>
                            </AreYouSureProvider>
                            <CardDescription className='col-span-3'>
                                A list of your active shares
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {shares.map((e, i) => {
                                return (
                                    <div key={i} className='flex items-center gap-2 space-y-2'>
                                        <span className='text-sm flex-1'>{e.email}</span>
                                        <AreYouSureProvider>
                                            <AreYouSure
                                                refreshOnYes={true}
                                                onClickYes={async () => {
                                                    'use server'
                                                    await deleteShare(e.id);
                                                }} />
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size='icon' variant='ghost' className='cursor-pointer'>
                                                        <EllipsisVertical />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <RevokeDropdownMenuItem>
                                                        Revoke
                                                    </RevokeDropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </AreYouSureProvider>
                                    </div>
                                );
                            })}
                            {shares.length === 0 && <>You have no active shares</>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className='grid grid-cols-3 items-center'>
                            <CardTitle className='col-span-2'>
                                Active share links ({shareLinks.length})
                            </CardTitle>
                            <AreYouSureProvider>
                                <AreYouSure
                                    yesText=<>Revoke all share links</>
                                    refreshOnYes={true}
                                    onClickYes={async () => {
                                        'use server'
                                        revokeAllShareLinks(service.id);
                                    }}>
                                    Are you sure you want to revoke all {service.name} share links?
                                </AreYouSure>
                                <RevokeButton>
                                    Revoke all
                                </RevokeButton>
                            </AreYouSureProvider>
                            <CardDescription className='col-span-3'>
                                A list of your active shares
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {shareLinks.map((e, i) => {
                                const diffMs = e.expires.getTime() - (new Date()).getTime();
                                const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60))); // prevent negative time
                                const hours = Math.floor(totalMinutes / 60);
                                const formatted = `${String(hours).padStart(2, '0')}h`;
                                return (
                                    <div key={i} className='flex items-center gap-2 space-y-2'>
                                        <span className='flex-1 grid lg:grid-cols-2'>
                                            <span className='text-sm'>{e.slug}</span>
                                            <span className='text-sm'>Expires in {formatted}</span>
                                        </span>
                                        <AreYouSureProvider>
                                            <AreYouSure
                                                refreshOnYes={true}
                                                onClickYes={async () => {
                                                    'use server'
                                                    await deleteShareLink(e.id);
                                                }} />
                                            <DropdownMenu modal={false}>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size='icon' variant='ghost' className='cursor-pointer'>
                                                        <EllipsisVertical />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <RevokeDropdownMenuItem>
                                                        Revoke
                                                    </RevokeDropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </AreYouSureProvider>
                                    </div>
                                );
                            })}
                            {shareLinks.length === 0 && <>You have no active share links</>}
                        </CardContent>
                    </Card>
                </div>
                <div>
                    {!service.enabled ? <>
                        <AreYouSureProvider>
                            <AreYouSure
                                yesButtonVariant='default'
                                refreshOnYes={true}
                                yesText=<>Yes I&apos;m sure</>
                                onClickYes={async () => {
                                    'use server'
                                    await enableService(service.id);
                                }}>
                                Are you sure you want to enable {service.name}? This will
                                allow all your identities and shares to access this service again.
                            </AreYouSure>
                            <RevokeButton variant='default'>Enable {service.name}</RevokeButton>
                        </AreYouSureProvider>
                    </> : <AreYouSureProvider>
                        <AreYouSure
                            refreshOnYes={true}
                            yesText=<>Yes I&apos;m sure</>
                            onClickYes={async () => {
                                'use server'
                                await disableService(service.id);
                            }}>
                            Are you sure you want to disable {service.name}? This will disable
                            the service from being dialed by your identities and shares.
                            It can be turned back on later.
                        </AreYouSure>
                        <RevokeButton variant='secondary'>Disable {service.name}</RevokeButton>
                    </AreYouSureProvider>}
                </div>
            </div> : <div className='flex flex-col gap-4'>
                <span className='text-left w-96 font-semibold text-2xl flex items-center gap-5'>
                    <h3>important!</h3>  <ArrowDown />
                </span>
                <Card className='w-72'>
                    <CardHeader>
                        <CardTitle>
                            Create a tunnel binding
                        </CardTitle>
                        <CardDescription>
                            Create a tunnel binding in the connectivity page to
                            start managing the service. This binding will act as the
                            &quot;plumbing&quot; for your other bindings. You can
                            also access it directly as well.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className='w-full' asChild>
                            <Link href={`/dashboard/services/${slug}/connectivity`}>Connectivity &rarr;</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>}
        </ >
    );
}

export default ServiceGeneral;
