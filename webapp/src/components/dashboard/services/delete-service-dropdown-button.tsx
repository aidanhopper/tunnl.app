'use client'

import { useAreYouSure } from "@/components/are-you-sure-provider";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Delete } from "lucide-react";

const DeleteServiceDropdownButton = () => {
    const { setOpen } = useAreYouSure();
    return (
        <DropdownMenuItem
            onClick={() => setOpen(true)}
            className='cursor-pointer duration-100'
            variant='destructive'>
            <Delete size={16} /> Delete
        </DropdownMenuItem>
    );
}

export default DeleteServiceDropdownButton;
