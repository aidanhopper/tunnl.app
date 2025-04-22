'use client'

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import deleteIdentity from "@/lib/actions/identities/delete-identity";
import { Delete } from "lucide-react";

const DeleteIdentityDropdownButton = ({ name }: { name: string }) => {
    return (
        <DropdownMenuItem
            onClick={() => deleteIdentity(name)}
            className='cursor-pointer duration-100'
            variant='destructive'>
            <Delete size={16} /> Delete
        </DropdownMenuItem>
    );
}

export default DeleteIdentityDropdownButton;
