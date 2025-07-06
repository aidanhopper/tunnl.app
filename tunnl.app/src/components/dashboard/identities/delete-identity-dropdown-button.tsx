'use client'

import AreYouSure from "@/components/are-you-sure";
import { useAreYouSure } from "@/components/are-you-sure-provider";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import deleteIdentity from "@/lib/actions/identities/delete-identity";
import { Delete } from "lucide-react";

const DeleteIdentityDropdownButton = ({ name }: { name: string }) => {
    const { setOpen } = useAreYouSure();
    return (
        <>
            <DropdownMenuItem
                onClick={() => setOpen(true)}
                className='cursor-pointer duration-100'
                variant='destructive'>
                <Delete size={16} /> Delete
            </DropdownMenuItem>
        </>
    );
}

export default DeleteIdentityDropdownButton;
