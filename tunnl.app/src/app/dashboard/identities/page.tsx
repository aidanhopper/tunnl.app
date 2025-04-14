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
    Settings,
    HelpingHand,
    Delete,
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateIdentityForm from "@/components/dashboard/identities/create-identity-form";

const devices = [
    {
        identity: 'Desktop',
        serviceCount: 10,
        created: '10/20/1991',
    },
    {
        identity: 'Mac',
        serviceCount: 435,
        created: '11/2/2010',
    }
];

const Identities = () => {
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
            <Table className='mt-10 hidden lg:table'>
                <TableCaption>A list of your authenticated devices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Identity</TableHead>
                        <TableHead>Services</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {devices.map((item, i) => (
                        <TableRow key={i}>
                            <TableCell>{item.identity}</TableCell>
                            <TableCell>{item.serviceCount}</TableCell>
                            <TableCell>{item.created}</TableCell>
                            <TableCell className='w-16'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' className='cursor-pointer'>
                                            <EllipsisVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            {item.identity}
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem className='cursor-pointer'>
                                                <HelpingHand size={16} /> Services
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='cursor-pointer'>
                                                <Settings size={16} /> Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className='cursor-pointer duration-100' variant='destructive'>
                                                <Delete size={16} /> Delete
                                            </DropdownMenuItem>
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
