import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getServiceBySlug } from "@/db/types/services.queries";
import { getServiceShareLinks } from "@/db/types/share_links.queries";
import { getSharesByServiceSlug } from "@/db/types/shares.queries";
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    General
                </CardTitle>
                <CardDescription>
                    Access general settings & information for {service.name}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-2 gap-12'>
                    <div>
                        <span className='flex items-center mb-1 flex-col lg:flex-row'>
                            <h3 className='text-sm font-semibold flex-1'>Active shares ({shares.length})</h3>
                            <Button className='text-xs' size='sm' variant='ghost'>Revoke all shares</Button>
                        </span>
                        <hr className='mb-1' />
                        {shares.map((e, i) => {
                            return (
                                <div key={i} className='flex items-center gap-2 '>
                                    <span className='text-sm flex-1'>{e.email}</span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size='icon' variant='ghost' className='cursor-pointer'>
                                                <EllipsisVertical />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                variant='destructive'
                                                className='cursor-pointer'>
                                                Revoke
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            );
                        })}
                    </div>
                    <div>
                        <span className='flex items-center mb-1 flex-col lg:flex-row'>
                            <h3 className='text-sm font-semibold flex-1'>Active share links ({shareLinks.length})</h3>
                            <Button className='text-xs' size='sm' variant='ghost'>Revoke all links</Button>
                        </span>
                        <hr className='mb-1' />
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
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size='icon' variant='ghost' className='cursor-pointer'>
                                                <EllipsisVertical />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                variant='destructive'
                                                className='cursor-pointer'>
                                                Revoke
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ServiceGeneral;
