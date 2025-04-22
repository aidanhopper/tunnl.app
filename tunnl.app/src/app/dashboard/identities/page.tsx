import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
    MonitorSmartphone,
    EllipsisVertical,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateIdentityForm from "@/components/dashboard/identities/create-identity-form";
import { getServerSession } from 'next-auth';
import { getIdentitiesByEmail } from "@/db/types/identities.queries";
import client from '@/lib/db';
import DeleteIdentityDropdownButton from "@/components/dashboard/identities/delete-identity-dropdown-button";
import Link from "next/link";

const Identities = async () => {
    const session = await getServerSession();
    const email = session?.user?.email;

    const identities = await getIdentitiesByEmail.run(
        {
            email: email
        },
        client
    );

    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-8'>
                    <MonitorSmartphone size={48} />
                    <h1>Identities</h1>
                </div>
                <div className='flex justify-end items-center'>
                    <Dialog>
                        <Button className='cursor-pointer' variant='ghost' asChild>
                            <DialogTrigger>
                                Create
                            </DialogTrigger>
                        </Button>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Create an Identity
                                </DialogTitle>
                                <DialogDescription>
                                    Create an identity that is used to authenticate with the Ziti network.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateIdentityForm />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Table className='mt-10'>
                <TableCaption>A list of your authenticated devices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Identity</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {identities.map((item, i) => (
                        <TableRow key={i}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.created?.toLocaleDateString()}</TableCell>
                            <TableCell className='w-16'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' className='cursor-pointer'>
                                            <EllipsisVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild className='cursor-pointer'>
                                            <Link href={`/dashboard/identities/${item.slug}`}>
                                                {item.name}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuGroup>
                                            <DeleteIdentityDropdownButton name={item.name} />
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>))}
                </TableBody>
            </Table>
        </DashboardLayout>
    )
}

export default Identities;
