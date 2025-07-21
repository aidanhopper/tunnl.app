import EditBindingForm from "@/components/dashboard/services/edit-binding-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getIdentitiesByEmail } from "@/db/types/identities.queries";
import { getTunnelBindingBySlug } from "@/db/types/tunnel_bindings.queries";
import client from "@/lib/db";
import getHostingIdentitySlug from "@/lib/get-hosting-identity-slug";
import { getPolicy } from "@/lib/ziti/policies";
import { getServerSession } from "next-auth";
import { forbidden, notFound, unauthorized } from "next/navigation";

const BindingPage = async ({ params }: { params: Promise<{ slug: string, binding_slug: string }> }) => {
    const session = await getServerSession();
    const email = session?.user?.email;
    if (!email) unauthorized();

    const bindingSlug = (await params).binding_slug;

    const bindingList = await getTunnelBindingBySlug.run({ slug: bindingSlug }, client);
    if (bindingList.length === 0) notFound();
    const binding = bindingList[0];

    if (binding.user_email !== email) forbidden();

    const policy = await getPolicy(binding.bind_policy_ziti_id);
    if (!policy) throw new Error('Policy does not exist');

    const hostingIdentitySlug = await getHostingIdentitySlug(binding.bind_policy_ziti_id);
    const identities = await getIdentitiesByEmail.run({ email: email }, client);

    return (
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
                identities={identities}
                hostingIdentitySlug={hostingIdentitySlug}
                binding={binding} />
        </div>
    )
}

export default BindingPage;
