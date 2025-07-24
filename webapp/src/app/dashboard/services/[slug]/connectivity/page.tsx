import { AreYouSureProvider } from "@/components/are-you-sure-provider";
import BindingDropdown from "@/components/dashboard/services/connectivity/binding-dropdown";
import CreateBindingForm from "@/components/dashboard/services/create-binding-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";
import { notFound, unauthorized } from "next/navigation";

const DashboardServiceConnectvity = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;
    const user = await new UserManager(pool).auth() || unauthorized();
    const identities = await user.getIdentityManager().getIdentities();
    const service = await user.getServiceManager().getServiceBySlug(slug) || notFound();
    const tunnelBinding = (await service.getTunnelBindingManager().getTunnelBindings())[0] ?? null;
    return (
        <Card>
            <CardHeader>
                <div className='grid grid-cols-2'>
                    <div className='grid grid-rows-2 gap-1 items-center'>
                        <CardTitle>Manage bindings</CardTitle>
                        <CardDescription>Connectivity settings for {service.getName()}</CardDescription>
                    </div>
                    <div className='justify-end grid items-center'>
                        <CreateBindingForm
                            tunnelBinding={tunnelBinding?.getClientData()}
                            service={service.getClientData()}
                            identities={identities.map(e => e.getClientData())} />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <AreYouSureProvider>
                    <Table>
                        <TableCaption>A list of your bindings</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Visibility</TableHead>
                                <TableHead>Config</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tunnelBinding && <TableRow>
                                <TableCell>Tunnel</TableCell>
                                <TableCell>Private</TableCell>
                                <TableCell className='grid grid-cols-1'>
                                    <div className='flex flex-col'>
                                        <span>
                                            { }
                                        </span>
                                        <span>{ }</span>
                                        <span>{ }</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex justify-end'>
                                        {/* <BindingDropdown */}
                                        {/*     serviceName={service.name} */}
                                        {/*     binding_slug={tunnelBinding.slug} */}
                                        {/*     slug={slug} */}
                                        {/*     tunnel_binding_id={tunnelBinding.id} */}
                                        {/*     service_id={service.id} /> */}
                                    </div>
                                </TableCell>
                            </TableRow>}
                        </TableBody>
                    </Table>
                </AreYouSureProvider>
            </CardContent>
        </Card >
    );
}

export default DashboardServiceConnectvity;
