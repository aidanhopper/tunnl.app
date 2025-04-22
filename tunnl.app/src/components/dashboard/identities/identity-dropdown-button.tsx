'use client'

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { redirect } from "next/navigation";

const IdentityDropdownButton = ({ slug }: { slug: string }) => {
    return (
        <DropdownMenuItem
            onClick={() => redirect(`/dashboard/identities/${slug}`)}
            className='cursor-pointer duration-100'>
            {slug}
        </DropdownMenuItem>
    );
}

export default IdentityDropdownButton;
