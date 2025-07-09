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
import { EllipsisVertical } from "lucide-react";
import { notFound } from "next/navigation";

const ServiceGeneral = async ({ params }: { params: { slug: string } }) => {
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

    return (
        <>
            {tunnelBinding ? <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                <Card>
                    <CardContent>
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
                        <div className='mx-6'>
                            <hr className='my-1' />
                            {shares.map((e, i) => {
                                return (
                                    <div key={i} className='flex items-center gap-2'>
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
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <CardHeader className='grid grid-cols-3 items-center'>
                            <CardTitle className='col-span-2'>
                                Active shares links ({shareLinks.length})
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
                        <div className='mx-6'>
                            <hr className='my-1' />
                            {shareLinks.map((e, i) => {
                                const diffMs = e.expires.getTime() - (new Date()).getTime();
                                const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60))); // prevent negative time
                                const hours = Math.floor(totalMinutes / 60);
                                const formatted = `${String(hours).padStart(2, '0')}h`;
                                return (
                                    <div key={i} className='flex items-center gap-2 '>
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
                        </div>
                    </CardContent>
                </Card>
            </div > : <div>
                <p className='text-md'>
                    Create a tunnel binding in the connectivity page to start managing the service
                </p>
            </div>
            }
        </>
    );
}

export default ServiceGeneral;
