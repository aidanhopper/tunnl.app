'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Delete, Edit, EllipsisVertical } from "lucide-react";
import AreYouSure from "@/components/are-you-sure";
import { useAreYouSure } from "@/components/are-you-sure-provider";
import Link from "next/link";
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

    const { setOpen } = useAreYouSure();

    return (
        <>
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
                    <DropdownMenuItem
                        variant='destructive'
                        className='cursor-pointer'
                        onClick={() => setOpen(true)}>
                        <Delete /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

export default BindingDropdown;
