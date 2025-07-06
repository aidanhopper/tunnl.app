'use client'

import { useAreYouSure } from "@/components/are-you-sure-provider";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

const RevokeButton = ({
    children,
}: {
    children?: ReactNode
}) => {
    const { setOpen } = useAreYouSure();
    return (
        <Button
            onClick={() => setOpen(true)}
            className='text-xs'
            size='sm'
            variant='ghost'>
            {children}
        </Button>
    );
}

export default RevokeButton;
