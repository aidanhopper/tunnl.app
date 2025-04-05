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

import Link from "next/link";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


const devices = [
    {
        device: 'Desktop',
        dns: '100.64.0.0/24',
        serviceCount: 10,
        lastLogin: 'Today',
        created: '10/20/1991',
        status: {
            tunnel: true,
            daemon: true,
        },
    },
    {
        device: 'Mac',
        dns: '100.64.0.0/24',
        serviceCount: 435,
        lastLogin: 'Today',
        created: '11/2/2010',
        status: {
            tunnel: false,
            daemon: false,
        },
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
    //for (let i = 0; i < 100; i++) devices.push(devices[i % 2]);
    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-8'>
                    <MonitorSmartphone size={48} />
                    <h1>Devices</h1>
                </div>
                <div className='flex justify-end items-center'>
                    <Button className='cursor-pointer' variant='ghost' asChild>
                        <Link href='/dashboard/devices/add'>
                            Add
                        </Link>
                    </Button>
                </div>
            </div>
            <Table className='mt-10 hidden lg:table'>
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
                    {devices.map((item, i) => (
                        <TableRow key={i}>
                            <TableCell>{item.device}</TableCell>
                            <TableCell>{item.dns}</TableCell>
                            <TableCell>{item.serviceCount}</TableCell>
                            <TableCell>{item.lastLogin}</TableCell>
                            <TableCell>{item.created}</TableCell>
                            <TableCell className='w-42'>
                                <div className='grid grid-rows-2 truncate'>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-16'>Tunnel</span>
                                        <StatusSymbol value={item.status.tunnel} />
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-16'>Daemon</span>
                                        <StatusSymbol value={item.status.daemon} />
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
                                            {item.device}
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
            <div className='grid gap-8 lg:hidden mt-8'>
                {devices.map((item, i) => (
                    <Card key={i}>
                        <CardHeader className='grid grid-cols-2 items-center'>
                            <CardTitle>{item.device}</CardTitle>
                            <DropdownMenu>
                                <div className='flex justify-end'>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' className='cursor-pointer justify-end'>
                                            <EllipsisVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                </div>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>
                                        {item.device}
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
                        </CardHeader>
                        <CardContent className='grid gap-4'>
                            <div className='grid grid-cols-2 w-48'>
                                <span>DNS</span>
                                <span>{item.dns}</span>
                            </div>
                            <div className='grid grid-cols-2 w-48'>
                                <span>Services</span>
                                <span>{item.serviceCount}</span>
                            </div>
                            <div className='grid grid-cols-2 w-48'>
                                <span>Last Seen</span>
                                <span>{item.lastLogin}</span>
                            </div>
                            <div className='grid grid-cols-2 w-48'>
                                <span>Created</span>
                                <span>{item.created}</span>
                            </div>
                            <div className='grid grid-cols-2 w-48'>
                                <span>Status</span>
                                <div>
                                    <span className='flex items-center gap-2'>
                                        <span className='w-22'>Tunnel</span>
                                        <StatusSymbol value={item.status.tunnel} />
                                    </span>
                                    <span className='flex items-center gap-2'>
                                        <span className='w-22'>Daemon</span>
                                        <StatusSymbol value={item.status.daemon} />
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>))}
            </div>
        </DashboardLayout>
    )
}

export default Devices;
