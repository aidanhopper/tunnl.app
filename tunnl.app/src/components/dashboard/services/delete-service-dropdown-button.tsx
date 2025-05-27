'use client'

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import deleteService from "@/lib/actions/services/delete-service";
import { Delete } from "lucide-react";
import { useRouter } from 'next/navigation';

const DeleteServiceDropdownButton = ({ name }: { name: string }) => {
    const router = useRouter()

    const onClick = async () => {
        await deleteService(name);
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

export default DeleteServiceDropdownButton;
