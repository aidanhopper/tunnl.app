import CreateBindingForm from "@/components/dashboard/services/create-binding-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getServiceBySlug } from "@/db/types/services.queries";
import client from "@/lib/db";
import { Delete, EllipsisVertical, Settings } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const DashboardServiceConnectvity = async ({ params }: { params: { slug: string } }) => {
    const slug = (await params).slug;

    const serviceList = await getServiceBySlug.run(
        {
            slug: slug
        },
        client
    );
    if (serviceList.length === 0) notFound();
    const service = serviceList[0]

    // TODO Add way to create a underlying ziti service binding using intercepts,
    // policies, and hosts and then associate them with the service with the id service.ziti_id
    //
    // Add form to create a ziti service 
    // Might want to make enrollment a better experience as well

    return (
        <Card>
            <CardHeader>
                <div className='grid grid-cols-2'>
                    <div className='grid grid-rows-2 gap-1 items-center'>
                        <CardTitle>Manage bindings</CardTitle>
                        <CardDescription>Connectivity settings for {service.name}</CardDescription>
                    </div>
                    <div className='justify-end grid items-center'>
                        <Dialog>
                            <Button className='cursor-pointer' variant='ghost' asChild>
                                <DialogTrigger>
                                    Create
                                </DialogTrigger>
                            </Button>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Create a binding
                                    </DialogTitle>
                                </DialogHeader>
                                <CreateBindingForm />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent className='h-96'>
                <Table>
                    <TableCaption>A list of your bindings</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Created</TableHead>
                            <TableCell>Config</TableCell>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Tunnel</TableCell>
                            <TableCell>Private</TableCell>
                            <TableCell>{service.created?.toLocaleString()}</TableCell>
                            <TableCell>Domain: postman.tunnl.app</TableCell>
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
                                                <Settings /> Settings
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem variant='destructive' className='cursor-pointer'>
                                                <Delete /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default DashboardServiceConnectvity;
