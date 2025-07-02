'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Share } from "lucide-react";
import { useEffect, useState } from "react";

const CreateShareButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        console.log('MOUNTED');
        return () => { console.log('UNMOUNTED') }
    }, [])
    return (
        <>
            <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => setIsOpen(!isOpen)}>
                <Share /> Share
            </DropdownMenuItem>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Share</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        CONTENT
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default CreateShareButton;
