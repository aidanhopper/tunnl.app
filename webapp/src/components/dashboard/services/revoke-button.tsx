'use client'

import { useAreYouSure } from "@/components/are-you-sure-provider";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

const RevokeButton = ({
    children,
    variant = 'secondary'
}: {
    children?: ReactNode,
    variant?: 'destructive' | 'default' | 'secondary' | 'outline' | 'ghost'
}) => {
    const { setOpen } = useAreYouSure();
    return (
        <Button
            onClick={() => setOpen(true)}
            className='text-xs cursor-pointer'
            size='sm'
            variant={variant}>
            {children}
        </Button>
    );
}

export default RevokeButton;
