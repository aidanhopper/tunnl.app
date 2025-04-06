import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Delete, EllipsisVertical, HelpingHand, Settings } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServicesTable from "@/components/dashboard/services/service-table";
import { Service } from "@/lib/types";

const services: Service[] = [
    {
        service: 'Portfolio',
        device: 'VPS-1',
        domain: 'my.portfolio',
        host: '127.0.0.1',
        ports: {
            forwardPorts: false,
            sourcePort: '3000',
            accessPort: '80'
        },
        publicShare: 'https://my-portfolio.srv.tunnl.app',
        created: '10/23/2025',
    }
]

const Services = () => {
    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-8'>
                    <HelpingHand size={48} />
                    <h1>Services</h1>
                </div>
                <div className='flex justify-end items-center'>
                    <Button className='cursor-pointer' variant='ghost' asChild>
                        <Link href='/dashboard/services/create'>
                            Create
                        </Link>
                    </Button>
                </div>
            </div>
            <ServicesTable services={services} />
            <div className='grid gap-8 lg:hidden mt-8'>
                {services.map((item, i) => (
                    <Card key={i}>
                        <CardHeader className='grid grid-cols-2 items-center'>
                            <CardTitle>{item.service}</CardTitle>
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
                                        {item.service}
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
                                <span>Device</span>
                                <span>{item.device}</span>
                            </div>
                            <div className='grid grid-cols-2 w-48'>
                                <span>Domain</span>
                                <span>{item.domain}</span>
                            </div>
                            <div className='grid grid-cols-2 w-48'>
                                <span>Host</span>
                                <span>{item.host}</span>
                            </div>
                            <div className='grid grid-cols-2 w-48'>
                                <span>Created</span>
                                <span>{item.created}</span>
                            </div>
                            <div className='flex'>
                                <span className='w-24'>Ports</span>
                                <div className='flex flex-col'>
                                    {!item.ports.forwardPorts ?
                                        <>
                                            <span className='flex'>
                                                <span className='flex w-24'>
                                                    Type
                                                </span>
                                                <span>
                                                    {item.ports.forwardPorts ? 'Ports Forwarded' : 'Proxied'}
                                                </span>
                                            </span>
                                            <span className='flex'>
                                                <span className='flex w-24'>
                                                    Source Port
                                                </span>
                                                <span>
                                                    {item.ports.sourcePort}
                                                </span>
                                            </span>
                                            <span className='flex'>
                                                <span className='flex w-24'>
                                                    Access Port
                                                </span>
                                                <span>
                                                    {item.ports.accessPort}
                                                </span>
                                            </span>
                                        </> : <></>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>))}
            </div>
        </DashboardLayout>
    );
}

export default Services;
