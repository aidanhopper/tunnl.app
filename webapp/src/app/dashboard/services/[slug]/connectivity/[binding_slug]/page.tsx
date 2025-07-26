import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";
import { notFound, unauthorized } from "next/navigation";

const BindingPage = async ({ params }: { params: Promise<{ slug: string, binding_slug: string }> }) => {
    const serviceSlug = (await params).slug;
    const bindingSlug = (await params).binding_slug;
    const user = await new UserManager(pool).auth() || unauthorized();
    const service = await user.getServiceManager().getServiceBySlug(serviceSlug) || notFound();
    const tunnelBinding = await service.getTunnelBindingManager().getTunnelBindingBySlug(bindingSlug);
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
            {/* <EditBindingForm */}
            {/*     identities={identities} */}
            {/*     hostingIdentitySlug={hostingIdentitySlug} */}
            {/*     binding={binding} /> */}
        </div>
    ) : <></>;
}

export default BindingPage;
