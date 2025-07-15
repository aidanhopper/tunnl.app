import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { MailIcon } from "lucide-react";
import { ReactNode } from "react";

const ApprovalCard = ({
    email,
    children,
    className = ''
}: { email: string | null | undefined, children?: ReactNode, className?: string }) => {
    return (
        <Card className={className}>
            <CardContent className='flex flex-col lg:flex-row items-center gap-4'>
                <h3 className='text-2xl font-semibold text-red-400 flex-1 col-span-3 text-center lg:text-left'>
                    Your account must be approved to create identities &amp; services
                </h3>
                <div className='flex lg:justify-end w-full md:w-fit'>
                    <Dialog>
                        <DialogTrigger className='cursor-pointer' asChild>
                            <Button className='w-full'>
                                Request
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Request Approval
                                </DialogTitle>
                                <DialogDescription>
                                    Request approval for your account so you can create identities,
                                    services, and access others shares
                                </DialogDescription>
                            </DialogHeader>
                            <div className='grid gap-4'>
                                <p>
                                    To request approval you can contact me via email
                                    aidanhop1@gmail.com or discord aidan12312. Once
                                    approved the changes will show up in your account
                                    immediately.
                                </p>
                                {email && <Button className='cursor-pointer' asChild>
                                    <Link href={`mailto:aidanhop1@gmail.com?subject=${encodeURIComponent(
                                        `Requesting Approval For ${email} in Tunnl.app`
                                    )}&body=${encodeURIComponent('<justification here>')}`}>
                                        Email <MailIcon />
                                    </Link>
                                </Button>}
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}

export default ApprovalCard;
