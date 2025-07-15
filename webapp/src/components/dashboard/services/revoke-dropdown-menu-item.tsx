'use client'

import { useAreYouSure } from "@/components/are-you-sure-provider";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";

const RevokeDropdownMenuItem = ({
    children,
}: {
    children?: ReactNode
}) => {
    const { setOpen } = useAreYouSure();
    return (
        <DropdownMenuItem
            onClick={() => setOpen(true)}
            variant='destructive'
            className='cursor-pointer'>
            {children}
        </DropdownMenuItem>
    );
}

export default RevokeDropdownMenuItem;
