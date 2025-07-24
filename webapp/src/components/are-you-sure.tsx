'use client'

import { useRouter } from "next/navigation";
import { useAreYouSure } from "./are-you-sure-provider";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { ReactNode } from "react";

const AreYouSure = ({
    onClickYes,
    refreshOnYes = false,
    children,
    yesText = 'Delete',
    yesButtonVariant = 'destructive',
}: {
    onClickYes: () => Promise<any> | any,
    refreshOnYes?: boolean,
    children?: ReactNode,
    yesText?: ReactNode,
    yesButtonVariant?: 'destructive' | 'default' | 'secondary' | 'outline' | 'ghost'
}) => {
    const { open, setOpen } = useAreYouSure();
    const router = useRouter();
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>
                    Are you sure?
                </DialogTitle>
                <DialogDescription>
                    {children}
                </DialogDescription>
                <div className='grid grid-cols-2 gap-4'>
                    <Button
                        className='cursor-pointer'
                        variant={yesButtonVariant}
                        onClick={async () => {
                            await onClickYes();
                            if (refreshOnYes) router.refresh();
                            setOpen(false);
                        }}>
                        {yesText}
                    </Button>
                    <Button
                        variant='secondary'
                        className='cursor-pointer'
                        onClick={() => setOpen(false)}>
                        I&apos;m not sure
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AreYouSure;
