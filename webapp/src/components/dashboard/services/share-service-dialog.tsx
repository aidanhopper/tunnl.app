'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import createShareLink from "@/lib/actions/shares/create-share-link";
import { ServiceClientData } from "@/lib/models/service";
import { ShareLinkClientData } from "@/lib/models/share-link";
import { Copy, Share } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

const ShareServiceDialog = ({ service }: { service: ServiceClientData }) => {
    const [shareLinkData, setShareLinkData] = useState<ShareLinkClientData | null>(null);
    const [copied, setCopied] = useState(false);

    const toUrl = (slug: string) => window.location.protocol + '//' + window.location.host + '/' + slug

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    }

    const generateShareLink = async () => {
        setCopied(false);
        setShareLinkData(null);
        setShareLinkData(await createShareLink({
            serviceSlug: service.slug,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            isOneTimeUse: true
        }));
    }


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
            {shareLinkData && <DialogContent className='w-[400px]'>
                <DialogHeader>
                    <DialogTitle className='text-center'>Share {service.name}</DialogTitle>
                    <DialogDescription className='text-center'>
                        Share this link, scan the QR code, or click the share button to give access to {service.name}
                    </DialogDescription>
                </DialogHeader>
                <div className='flex bg-accent rounded-sm pl-2 items-center'>
                    <span className='flex-1'>
                        {shareLinkData && toUrl(shareLinkData.slug)}
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
                <Button 
                    onClick={handleShareButton}
                    className='w-full'>
                    <Share /> Share
                </Button>
            </DialogContent>}
            <DialogTrigger
                asChild
                onClick={generateShareLink}>
                <Button className='cursor-pointer'>
                    <Share /> Share
                </Button>
            </DialogTrigger>
        </Dialog>
    );
}

export default ShareServiceDialog;
