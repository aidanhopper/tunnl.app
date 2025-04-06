'use client'

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Service } from "@/lib/types"
import { Delete, EllipsisVertical, Settings } from "lucide-react"
import Link from "next/link"

const ServicesTable = ({ services }: { services: Service[] }) => {
    return (
        <Table className='mt-10 hidden lg:table'>
            <TableCaption>A list of your services.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Ports</TableHead>
                    <TableHead>Public Share</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead />
                </TableRow>
            </TableHeader>
            <TableBody>
                {services.map(item => (
                    <TableRow key={item.service}>
                        <TableCell>{item.service}</TableCell>
                        <TableCell>{item.device}</TableCell>
                        <TableCell>{item.domain}</TableCell>
                        <TableCell>{item.host}</TableCell>
                        <TableCell>
                            <div className='flex flex-col'>
                                <span className='flex'>
                                    <span className='flex w-24'>
                                        Type
                                    </span>
                                    <span>
                                        {item.ports.forwardPorts ? 'Ports Forwarded' : 'Proxied'}
                                    </span>
                                </span>
                                {item.ports.forwardPorts ?
                                    <>
                                    </> :
                                    <>
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
                                    </>}
                            </div>
                        </TableCell>
                        <TableCell>
                            {item.publicShare ?
                                <Button variant='link' asChild className='p-0'>
                                    <Link href={item.publicShare}>
                                        {item.publicShare}
                                    </Link>
                                </Button> :
                                <>None</>}
                        </TableCell>
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
                                        {item.service}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className='cursor-pointer'>
                                            <Settings size={16} /> Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className='cursor-pointer duration-100'
                                            variant='destructive'>
                                            <Delete size={16} /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default ServicesTable;
