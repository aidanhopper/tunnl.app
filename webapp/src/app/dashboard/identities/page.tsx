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
    DropdownMenuTrigger,
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
import SubscribeProvider from "@/components/subscribe-provider";
import generateToken from "@/lib/subscribe/generate-token";
import RefreshOnEvent from "@/components/dashboard/refresh-on-event";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreYouSureProvider } from "@/components/are-you-sure-provider";
import AreYouSure from "@/components/are-you-sure";
import deleteIdentity from "@/lib/actions/identities/delete-identity";
import userIsApproved from "@/lib/user-is-approved";
import ApprovalCard from "@/components/dashboard/approval-card";

const Identities = async () => {
    const session = await getServerSession();
    const email = session?.user?.email;
    const approved = await userIsApproved(email);

    const identities = await getIdentitiesByEmail.run({ email: email }, client);

    if (!process.env.NEXT_PUBLIC_PUBLISHER_URL) return <>Error</>;

    const token = generateToken({ topics: identities.map(i => i.ziti_id) });

    return (
        <DashboardLayout>
            <div className='flex gap-8 flex-col'>
                <SubscribeProvider url={process.env.NEXT_PUBLIC_PUBLISHER_URL} token={token}>
                    <RefreshOnEvent onEvent={async (payload) => {
                        'use server'
                        return payload.namespace === 'sdk'
                            && (payload.eventType === 'sdk-online'
                                || payload.eventType === 'sdk-offline')
                    }}>
                        <div className='flex'>
                            <div className='flex flex-1 items-center gap-8'>
                                <MonitorSmartphone size={48} />
                                <h1>Identities</h1>
                            </div>
                            <div className='flex justify-end items-center'>
                                <Dialog>
                                    <Button
                                        className='cursor-pointer'
                                        variant='secondary'
                                        disabled={!approved}
                                        asChild>
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
                        {!approved &&
                            <ApprovalCard
                                email={email} />}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Identities List
                                </CardTitle>
                                <CardDescription>
                                    This is where your identities will be when you create them
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableCaption>A list of your authenticated devices.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Identity</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {identities.map((item, i) => (
                                            <TableRow key={i}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.created?.toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    {item.is_online ?
                                                        <div className='flex gap-4 items-center'>
                                                            <div className='w-10'>
                                                                Online
                                                            </div>
                                                            <div className='rounded-full bg-green-400 w-2 h-2' />
                                                        </div> :
                                                        <div className='flex gap-4 items-center'>
                                                            <div className='w-10'>
                                                                Offline
                                                            </div>
                                                            <div className='rounded-full bg-red-400 w-2 h-2' />
                                                        </div>}
                                                </TableCell>
                                                <TableCell className='w-16'>
                                                    <AreYouSureProvider>
                                                        <AreYouSure
                                                            refreshOnYes={true}
                                                            onClickYes={async () => {
                                                                'use server'
                                                                await deleteIdentity(item.name)
                                                            }}>
                                                            Are you sure you want to delete this identity
                                                        </AreYouSure >
                                                        <DropdownMenu modal={false}>
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
                                                    </AreYouSureProvider>
                                                </TableCell>
                                            </TableRow>))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </RefreshOnEvent>
                </SubscribeProvider>
            </div>
        </DashboardLayout>
    );
}

export default Identities;
