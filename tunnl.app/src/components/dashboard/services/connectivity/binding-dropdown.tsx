'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Copy, Delete, EllipsisVertical, Share } from "lucide-react";
import { deleteTunnelBinding } from "@/lib/actions/services/delete-tunnel-binding";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import createShareLink from "@/lib/actions/shares/create-share-link";
import { useState } from "react";

const BindingDropdown = ({ id }: { id: string }) => {
    const router = useRouter()
    const [shareLinkData, setShareLinkData] = useState<{ slug: string, expires: Date } | null>(null)

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
    }

    const generateShareLink = async () => {
        console.log('generating share link')
        setShareLinkData(await createShareLink(id));
    }

    const toUrl = (slug: string) => window.location.protocol + '//' + window.location.host + '/' + slug

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='cursor-pointer'>
                        <EllipsisVertical />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
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
                        onClick={async () => {
                            await deleteTunnelBinding(id);
                            router.refresh();
                        }}>
                        <Delete /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Link</DialogTitle>
                    <DialogDescription>
                        Share this link to give access to this binding
                    </DialogDescription>
                </DialogHeader>
                <div className='flex bg-accent rounded-sm px-1 items-center'>
                    <span className='flex-1'>
                        {toUrl(shareLinkData?.slug ?? '')}
                    </span>
                    <Button
                        onClick={() => handleCopy(toUrl(shareLinkData?.slug ?? ''))}
                        variant='ghost'
                        className='cursor-pointer'>
                        <Copy />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default BindingDropdown;
