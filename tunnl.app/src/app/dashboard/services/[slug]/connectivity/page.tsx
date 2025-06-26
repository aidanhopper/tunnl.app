import CreateBindingForm from "@/components/dashboard/services/create-binding-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getIdentitiesByEmail } from "@/db/types/identities.queries";
import { getServiceBySlug } from "@/db/types/services.queries";
import { getTunnelBindingsByServiceSlug } from "@/db/types/tunnel_bindings.queries";
import client from "@/lib/db";
import { Delete, EllipsisVertical, Settings } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, unauthorized } from "next/navigation";

const DashboardServiceConnectvity = async ({ params }: { params: { slug: string } }) => {
    const slug = (await params).slug;

    const session = await getServerSession();

    if (!session?.user?.email) unauthorized();

    const email = session.user.email;

    const serviceList = await getServiceBySlug.run(
        {
            slug: slug
        },
        client
    );
    if (serviceList.length === 0) notFound();
    const service = serviceList[0]

    const identities = await getIdentitiesByEmail.run(
        {
            email: email
        },
        client
    )

    const tunnelBindings = await getTunnelBindingsByServiceSlug.run(
        {
            slug: slug
        },
        client
    );

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
                        <CreateBindingForm
                            serviceSlug={slug}
                            identities={identities} />
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
                            <TableCell>Config</TableCell>
                            <TableHead />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tunnelBindings.map((e, i) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell>Tunnel</TableCell>
                                    <TableCell>Private</TableCell>
                                    <TableCell className='grid grid-cols-1'>
                                        <div>
                                            Intercept: {e.intercept_addresses[0]}
                                        </div>
                                        <div>
                                            Intercept port ranges: {e.intercept_port_ranges}
                                        </div>
                                        <div>
                                            Host address: {e.host_address}
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
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default DashboardServiceConnectvity;
