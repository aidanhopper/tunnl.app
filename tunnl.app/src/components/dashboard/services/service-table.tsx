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
import { IGetServicesByEmailResult } from "@/db/types/services.queries"
import { EllipsisVertical } from "lucide-react"
import DeleteServiceDropdownButton from "./delete-service-dropdown-button"
import Link from "next/link"

const ServicesTable = ({ services }: { services: IGetServicesByEmailResult[] }) => {
    return (
        <Table>
            <TableCaption>A list of your services.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Protocol Family</TableHead>
                    <TableHead />
                </TableRow>
            </TableHeader>
            <TableBody>
                {services.map((service, i) => (
                    <TableRow key={i}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.created?.toLocaleString()}</TableCell>
                        <TableCell>{service.protocol.toUpperCase()}</TableCell>
                        <TableCell className='w-16'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className='cursor-pointer'>
                                        <EllipsisVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        className='cursor-pointer'
                                        asChild>
                                        <Link href={`/dashboard/services/${service.slug}`}>
                                            {service.name}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuGroup>
                                        <DeleteServiceDropdownButton name={service.name} />
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
