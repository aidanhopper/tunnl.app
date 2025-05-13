'use client'

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import deleteIdentity from "@/lib/actions/identities/delete-identity";
import { Delete } from "lucide-react";
import { useRouter } from 'next/navigation';

const DeleteIdentityDropdownButton = ({ name }: { name: string }) => {
    const router = useRouter()

    const onClick = async () => {
        await deleteIdentity(name);
        router.refresh();
    }

    return (
        <DropdownMenuItem
            onClick={onClick}
            className='cursor-pointer duration-100'
            variant='destructive'>
            <Delete size={16} /> Delete
        </DropdownMenuItem>
    );
}

export default DeleteIdentityDropdownButton;
