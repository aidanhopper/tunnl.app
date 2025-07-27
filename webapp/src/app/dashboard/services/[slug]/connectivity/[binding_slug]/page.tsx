import EditBindingForm from "@/components/dashboard/services/edit-binding-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";
import { notFound, unauthorized } from "next/navigation";

const BindingPage = async ({ params }: { params: Promise<{ slug: string, binding_slug: string }> }) => {
    const serviceSlug = (await params).slug;
    const bindingSlug = (await params).binding_slug;
    const user = await new UserManager(pool).auth() || unauthorized();
    const identities = await user.getIdentityManager().getIdentities();
    const service = await user.getServiceManager().getServiceBySlug(serviceSlug) || notFound();
    const serviceClientData = await service.getClientData();
    const tunnelBinding = await service.getTunnelBindingManager().getTunnelBindingBySlug(bindingSlug) || notFound();
    const hostingIdentity = await tunnelBinding.getHostingIdentity();
    const tunnelBindingClientData = await tunnelBinding.getClientData();
    return tunnelBinding ? (
        <div className='grid gap-8'>
            <Card>
                <CardHeader>
                    <CardTitle>
                        Edit Binding
                    </CardTitle>
                    <CardDescription>
                        Edit the settings of this binding. Click save to update the binding.
                    </CardDescription>
                </CardHeader>
            </Card>
            <EditBindingForm
                service={serviceClientData}
                identities={identities.map(e => e.getClientData())}
                hostingIdentity={hostingIdentity?.getClientData() ?? null}
                tunnelBinding={tunnelBindingClientData} />
        </div>
    ) : <></>;
}

export default BindingPage;
