'use client'

import { useAreYouSure } from "@/components/are-you-sure-provider"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Delete } from "lucide-react";

const DeleteShareButton = () => {
    const { setOpen } = useAreYouSure();
    return (
        <DropdownMenuItem
            variant='destructive'
            className='cursor-pointer'
            onClick={() => setOpen(true)}>
            <Delete /> Delete
        </DropdownMenuItem>
    );
}

export default DeleteShareButton;
