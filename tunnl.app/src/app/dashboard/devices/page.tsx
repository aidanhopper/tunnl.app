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
    ComputerIcon,
    Settings,
    HelpingHand,
} from 'lucide-react';
import Link from "next/link";

const devices = [
    {
        name: 'Desktop',
        dns: '100.64.0.0/24',
        status: 'off'
    }
];

const StatusSymbol = ({ value }: { value: boolean }) => {
    return value ? (
        <div className='bg-green-500 rounded-full w-2 h-2' />
    ) : (
        <div className='bg-red-500 rounded-full w-2 h-2' />
    );
}

const Devices = () => {
    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-8'>
                    <MonitorSmartphone size={48} />
                    <h1>Devices</h1>
                </div>
                <div className='flex justify-end items-center'>
                    <Button className='cursor-pointer' variant='link' asChild>
                        <Link href='/dashboard/devices/add'>
                            Add a device
                        </Link>
                    </Button>
                </div>
            </div>
            <Table className='mt-10'>
                <TableCaption>A list of your authenticated devices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>DNS</TableHead>
                        <TableHead>Services</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>Desktop</TableCell>
                        <TableCell>100.24.54.11/24</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>Today</TableCell>
                        <TableCell>10/20/1991</TableCell>
                        <TableCell className='w-42'>
                            <div className='grid grid-rows-2 truncate'>
                                <div className='flex items-center gap-2'>
                                    <span className='w-16'>Tunnel</span>
                                    <StatusSymbol value={true} />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='w-16'>Daemon</span>
                                    <StatusSymbol value={true} />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className='w-16'>Autostart</span>
                                    <StatusSymbol value={false} />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className='w-16'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className='cursor-pointer'>
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>
                                        Desktop
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <HelpingHand size={16} /> Services
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <Settings size={16} /> Settings
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </DashboardLayout>
    )
}

export default Devices;