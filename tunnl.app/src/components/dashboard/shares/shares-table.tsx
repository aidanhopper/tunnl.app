'use client'

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IGetSharesByEmailResult } from "@/db/types/shares.queries";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical } from "lucide-react";

const SharesTable = ({ shares }: { shares: IGetSharesByEmailResult[] }) => {
    return (
        <Table>
            <TableCaption>A list of your shares.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead />
                </TableRow>
            </TableHeader>
            <TableBody>
                {shares.map((share, i) => {
                    return (
                        <TableRow key={i}>
                            <TableCell>{share.service_name}</TableCell>
                            <TableCell>{share.owner_email}</TableCell>
                            <TableCell>{share.service_protocol === 'http' ? 'http' : share.intercept_protocol}</TableCell>
                            <TableCell>{share.intercept_addresses[0]}</TableCell>
                            <TableCell className='w-16'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' className='cursor-pointer'>
                                            <EllipsisVertical />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            variant='destructive'
                                            className='cursor-pointer'>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

export default SharesTable;
