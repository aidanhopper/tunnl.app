'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='cursor-pointer'>
                    Enroll
                </Button>
            </DialogTrigger>
            <DialogContent className='w-[350px]'>
                <DialogHeader>
                    <DialogTitle className='text-center'>
                        Enroll the Identity
                    </DialogTitle>
                    <DialogDescription className='text-center'>
                        Enroll with a file or scan the QR code in a Ziti edge app.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex justify-center content-center flex-col gap-8 w-full h-full'>
                    <QRCode
                        className='border-4 border-white block'
                        size={300}
                        value={value} />
                    <Button
                        className='cursor-pointer w-[300px]'
                        onClick={downloadFile}>
                        Download JWT File
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default EnrollIdentityDialog;
