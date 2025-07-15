'use client'

import { ReactNode } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const DownloadButton = ({ children, href }: { children?: ReactNode, href: string }) => {
    return (
        <Button
            className='lg:text-2xl md:text-xl text-center p-8 lg:p-10 font-bold'
            asChild>
            <Link href={href} target='_blank'>
                {children}
            </Link>
        </Button>
    );
}

export default DownloadButton;
