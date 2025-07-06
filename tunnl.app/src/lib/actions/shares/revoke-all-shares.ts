'use server'

import { getServiceByIdAndEmail } from "@/db/types/services.queries";
import { deleteAllServiceShares } from "@/db/types/shares.queries";
import client from "@/lib/db";
import removeDialPoliciesFromUserIdentities from "@/lib/remove-dial-policies-from-user-identities";
import dialRole from "@/lib/ziti/dial-role";
import { getServerSession } from "next-auth";
import { notFound, unauthorized } from "next/navigation";

const revokeAllShares = async (service_id: string) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) unauthorized();
        const email = session.user.email;

        const serviceList = await getServiceByIdAndEmail.run({ id: service_id, email: email }, client);
        if (serviceList.length === 0) notFound();

        const deletedShares = await deleteAllServiceShares.run({ service_id: service_id }, client);
        await Promise.all(
            deletedShares.map(e => removeDialPoliciesFromUserIdentities({
                dialRole: dialRole(e.service_slug),
                user_id: e.user_id
            }))
        );

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default revokeAllShares;
