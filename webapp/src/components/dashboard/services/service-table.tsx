import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { EllipsisVertical } from "lucide-react"
import DeleteServiceDropdownButton from "./delete-service-dropdown-button"
import Link from "next/link"
import { AreYouSureProvider } from "@/components/are-you-sure-provider"
import AreYouSure from "@/components/are-you-sure"
import deleteService from "@/lib/actions/services/delete-service"
import { ServiceClientData } from "@/lib/models/service"

const ServicesTable = ({ services }: { services: ServiceClientData[] }) => {
    return (
        <Table>
            <TableCaption>A list of your services.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Protocol Family</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead />
                </TableRow>
            </TableHeader>
            <TableBody>
                {services.map((service, i) => (
                    <TableRow key={i}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.created?.toLocaleString()}</TableCell>
                        <TableCell>{service.protocol.toUpperCase()}</TableCell>
                        <TableCell>{service.enabled ? 'True' : 'False'}</TableCell>
                        <TableCell className='w-16'>
                            <AreYouSureProvider>
                                <AreYouSure
                                    refreshOnYes={true}
                                    onClickYes={async () => {
                                        'use server'
                                        await deleteService(service.slug); 
                                    }}>
                                    Are you sure you want to delete this service?
                                </AreYouSure>
                                <DropdownMenu modal={false}>
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
                                            <DeleteServiceDropdownButton />
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </AreYouSureProvider>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default ServicesTable;
