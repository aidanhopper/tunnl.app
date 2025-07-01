'use client'

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Delete } from "lucide-react";
import { useRouter } from "next/navigation";

const DeleteTunnelBindingButton = ({ onClick }: { onClick: () => Promise<void> }) => {
    const router = useRouter()
    return (
        <DropdownMenuItem
            variant='destructive'
            className='cursor-pointer'
            onClick={async () => {
                await onClick();
                router.refresh();
            }}>
            <Delete /> Delete
        </DropdownMenuItem>
    );
}

export default DeleteTunnelBindingButton;
