import EditBindingForm from "@/components/dashboard/services/edit-binding-form";
import { getIdentitiesByEmail, getIdentityByZitiId } from "@/db/types/identities.queries";
import { getTunnelBindingBySlug } from "@/db/types/tunnel_bindings.queries";
import client from "@/lib/db";
import { getPolicy } from "@/lib/ziti/policies";
import { getServerSession } from "next-auth";
import { forbidden, unauthorized } from "next/navigation";

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

    let hostingIdentitySlug: string | null = null;

    if (policy.data.identityRoles.length !== 0) {
        const hostingIdentityZitiId = policy.data.identityRoles[0].substring(1);
        const identityList = await getIdentityByZitiId.run({ ziti_id: hostingIdentityZitiId }, client);
        if (identityList.length !== 0)
            hostingIdentitySlug = identityList[0].slug;
    }

    const identities = await getIdentitiesByEmail.run({ email: email }, client);

    return <EditBindingForm
        identities={identities}
        hostingIdentitySlug={hostingIdentitySlug}
        binding={binding} />
}

export default BindingPage;
function notFound() {
    throw new Error("Function not implemented.");
}
