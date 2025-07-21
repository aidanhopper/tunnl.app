import { AreYouSureProvider } from "@/components/are-you-sure-provider";
import BindingDropdown from "@/components/dashboard/services/connectivity/binding-dropdown";
import CreateBindingForm from "@/components/dashboard/services/create-binding-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getIdentitiesByEmail } from "@/db/types/identities.queries";
import { getServiceBySlug } from "@/db/types/services.queries";
import { getTunnelBindingsByServiceSlug, IGetTunnelBindingsByServiceSlugResult } from "@/db/types/tunnel_bindings.queries";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound, unauthorized } from "next/navigation";

const DashboardServiceConnectvity = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;

    const session = await getServerSession();
    if (!session?.user?.email) unauthorized();
    const email = session.user.email;

    const serviceList = await getServiceBySlug.run({ slug: slug }, client);
    if (serviceList.length === 0) notFound();
    const service = serviceList[0]

    const identities = await getIdentitiesByEmail.run({ email: email }, client)

    let tunnelBinding: null | IGetTunnelBindingsByServiceSlugResult = null;
    const tunnelBindings = await getTunnelBindingsByServiceSlug.run({ slug: slug }, client);
    if (tunnelBindings.length !== 0) tunnelBinding = tunnelBindings[0];

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
                            tunnelBinding={tunnelBinding}
                            serviceSlug={slug}
                            identities={identities} />
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
                                            {service.protocol === 'http' ? 'http' : tunnelBinding.host_protocol}
                                        </span>
                                        <span>{tunnelBinding.intercept_addresses[0]}</span>
                                        <span>{tunnelBinding.intercept_port_ranges}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex justify-end'>
                                        <BindingDropdown
                                            serviceName={service.name}
                                            binding_slug={tunnelBinding.slug}
                                            slug={slug}
                                            tunnel_binding_id={tunnelBinding.id}
                                            service_id={service.id} />
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
