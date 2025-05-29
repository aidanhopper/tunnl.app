'use client'

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const ServiceNavButton = ({ children, className, activePath = '' }: { children?: ReactNode, className?: string, activePath?: string }) => {
    const path = usePathname();
    const isActive = path === activePath;

    return (
        <Button
            variant='ghost'
            className={`${className} h-8 w-26 cursor-pointer ${isActive ? 'bg-accent' : ''}`}>
            {children}
        </Button>
    );
}

export default ServiceNavButton;
