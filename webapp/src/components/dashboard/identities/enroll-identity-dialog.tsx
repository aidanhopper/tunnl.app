'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy } from "lucide-react";
import { useState } from "react";
import QRCode from "react-qr-code";

const EnrollIdentityDialog = ({ fileName, value }: { fileName: string, value: string }) => {
    const downloadFile = () => {
        const blob = new Blob([value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const [copied, setCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='cursor-pointer'>
                    Enroll
                </Button>
            </DialogTrigger>
            <DialogContent className='w-fit'>
                <DialogHeader>
                    <DialogTitle className='text-center'>
                        Enroll the Identity
                    </DialogTitle>
                    <DialogDescription className='text-center'>
                        Enroll with a file or scan the QR code in a ziti edge app.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex justify-center content-center flex-col gap-6 w-full h-full'>
                    <span className='w-full flex justify-center'>
                        <span className='w-fit p-1 bg-white'>
                            <QRCode
                                size={345}
                                value={value} />
                        </span>
                    </span>
                    <div className='grid grid-cols-2 gap-4'>
                        <Button
                            className='cursor-pointer'
                            onClick={downloadFile}>
                            Download JWT File
                        </Button>
                        <TooltipProvider>
                            <Tooltip open={copied}>
                                <TooltipTrigger asChild>
                                    <Button
                                        className='cursor-pointer'
                                        onClick={onCopy}>
                                        Copy token <Copy />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Copied token
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default EnrollIdentityDialog;
