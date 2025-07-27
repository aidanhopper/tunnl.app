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
    const tunnelBinding = await service.getTunnelBindingManager().getTunnelBindingBySlug(bindingSlug) || notFound();
    const hostingIdentity = await tunnelBinding.getHostingIdentity();
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
                identities={identities.map(e => e.getClientData())}
                hostingIdentity={hostingIdentity?.getClientData() ?? null}
                binding={await tunnelBinding.getClientData()} />
        </div>
    ) : <></>;
}

export default BindingPage;
