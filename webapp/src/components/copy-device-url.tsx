'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Copy } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';

const CopyDeviceUrl = ({ url }: { url: string }) => {
    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    return (
        <div className='flex gap-4 items-center'>
            <span className='flex font-mono w-full py-1 bg-accent px-2 rounded-md h-full items-center'>
                {url}
            </span>
            <TooltipProvider>
                <Tooltip open={copied}>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={onCopy}
                            className={`cursor-pointer h-full`}
                        >
                            <Copy />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Copied the URL
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

export default CopyDeviceUrl;
