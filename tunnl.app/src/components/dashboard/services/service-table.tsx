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
import { Delete, EllipsisVertical, Settings } from "lucide-react"

const ServicesTable = () => {
    return (
        <Table className='mt-10'>
            <TableCaption>A list of your services.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Private Domain</TableHead>
                    <TableHead>Identity</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead />
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* {[].map(item => ( */}
                {/*     <TableRow key={item.service}> */}
                {/*         <TableCell>{item.service}</TableCell> */}
                {/*         <TableCell>{item.domain}</TableCell> */}
                {/*         <TableCell>{item.device}</TableCell> */}
                {/*         <TableCell>{item.created}</TableCell> */}
                {/*         <TableCell className='w-16'> */}
                {/*             <DropdownMenu> */}
                {/*                 <DropdownMenuTrigger asChild> */}
                {/*                     <Button variant='ghost' className='cursor-pointer'> */}
                {/*                         <EllipsisVertical /> */}
                {/*                     </Button> */}
                {/*                 </DropdownMenuTrigger> */}
                {/*                 <DropdownMenuContent> */}
                {/*                     <DropdownMenuLabel> */}
                {/*                         {item.service} */}
                {/*                     </DropdownMenuLabel> */}
                {/*                     <DropdownMenuSeparator /> */}
                {/*                     <DropdownMenuGroup> */}
                {/*                         <DropdownMenuItem className='cursor-pointer'> */}
                {/*                             <Settings size={16} /> Config */}
                {/*                         </DropdownMenuItem> */}
                {/*                         <DropdownMenuItem */}
                {/*                             className='cursor-pointer duration-100' */}
                {/*                             variant='destructive'> */}
                {/*                             <Delete size={16} /> Delete */}
                {/*                         </DropdownMenuItem> */}
                {/*                     </DropdownMenuGroup> */}
                {/*                 </DropdownMenuContent> */}
                {/*             </DropdownMenu> */}
                {/*         </TableCell> */}
                {/*     </TableRow> */}
                {/* ))} */}
            </TableBody>
        </Table>
    );
}

export default ServicesTable;
