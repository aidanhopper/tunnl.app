'use client'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Copy, Delete, Edit, EllipsisVertical, Share } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import AreYouSure from "@/components/are-you-sure";
import { useAreYouSure } from "@/components/are-you-sure-provider";
import Link from "next/link";
import QRCode from "react-qr-code";
import { TunnelBindingClientData } from '@/lib/models/tunnel-binding';
import { ServiceClientData } from '@/lib/models/service';
import { deleteTunnelBinding } from '@/lib/actions/services/delete-tunnel-binding';

const BindingDropdown = ({
    tunnelBinding,
    service,
}: {
    tunnelBinding: TunnelBindingClientData,
    service: ServiceClientData,
}) => {
    const [shareLinkData, setShareLinkData] = useState<{ slug: string, expires: Date } | null>(null)
    const [copied, setCopied] = useState(false);

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    }

    const generateShareLink = async () => {
        setCopied(false);
        setShareLinkData(null);
        console.log('generating share link')
        // setShareLinkData(await createTunnelBindingShareLink({
        //     service_id: service_id,
        //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        //     isOneTimeUse: true
        // }));
    }

    const toUrl = (slug: string) => window.location.protocol + '//' + window.location.host + '/' + slug

    const { setOpen } = useAreYouSure();

    const handleShareButton = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Invite to access the ${service.name} service's tunnel binding.`,
                    text: `Click the link to join today!`,
                    url: toUrl(shareLinkData?.slug ?? '')
                })
            } catch { }
        } else {
            console.error('Sharing is not supported on this browser');
        }
    }

    return (
        <Dialog>
            <AreYouSure
                onClickYes={() => deleteTunnelBinding({
                    tunnelBindingSlug: tunnelBinding.slug,
                    serviceSlug: service.slug,
                })}
                refreshOnYes={true}>
                Are you sure you want to delete this binding?
            </AreYouSure>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='cursor-pointer'>
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        className='cursor-pointer'
                        onClick={() => { }}
                        asChild>
                        <Link href={`/dashboard/services/${service.slug}/connectivity/${tunnelBinding.slug}`}>
                            <Edit /> Edit
                        </Link>
                    </DropdownMenuItem>
                    <DialogTrigger
                        onClick={generateShareLink}
                        className='w-full'>
                        <DropdownMenuItem className='cursor-pointer w-full'>
                            <Share /> Share
                        </DropdownMenuItem>
                    </DialogTrigger>
                    <DropdownMenuItem
                        variant='destructive'
                        className='cursor-pointer'
                        onClick={() => setOpen(true)}>
                        <Delete /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {shareLinkData?.slug && <DialogContent className='w-[400px]'>
                <DialogHeader>
                    <DialogTitle className='text-center'>Share {service.name}</DialogTitle>
                    <DialogDescription className='text-center'>
                        Share this link, scan the QR code, or click the share button to give access to {service.name}
                    </DialogDescription>
                </DialogHeader>
                <div className='flex bg-accent rounded-sm pl-2 items-center'>
                    <span className='flex-1'>
                        {toUrl(shareLinkData.slug)}
                    </span>
                    <TooltipProvider>
                        <Tooltip open={copied}>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => handleCopy(toUrl(shareLinkData.slug))}
                                    size='icon'
                                    className='rounded-l-none cursor-pointer'>
                                    <Copy />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Copied the URL
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className='flex items-center justify-center'>
                    <div className='bg-white p-2 rounded'>
                        <QRCode
                            size={330}
                            value={toUrl(shareLinkData.slug)} />
                    </div>
                </div>
                <Button className='cursor-pointer' onClick={handleShareButton}>
                    Share
                </Button>
            </DialogContent>}
        </Dialog>
    );
}

export default BindingDropdown;
