'use server';

import { getTunnelBinding } from "@/db/types/tunnel_bindings.queries";
import { deleteZitiHost } from "@/db/types/ziti_hosts.queries";
import { deleteZitiIntercept } from "@/db/types/ziti_intercepts.queries";
import { deleteZitiPolicy } from "@/db/types/ziti_policies.queries";
import { deleteTunnelBinding as deleteTunnelBindingDb } from "@/db/types/tunnel_bindings.queries"
import client from "@/lib/db";
import { deleteConfig } from "@/lib/ziti/configs";
import { deletePolicy } from "@/lib/ziti/policies";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/db/types/users.queries";
import { getService } from "@/db/types/services.queries";
import { getIdentity, patchIdentity } from "@/lib/ziti/identities";
import { getUserIdentities } from "@/db/types/identities.queries";

export const deleteTunnelBinding = async (id: string) => {
    try {
        const session = await getServerSession();
        const email = session?.user?.email;
        if (!email) return;
        const userList = await getUserByEmail.run({ email: email }, client);
        if (userList.length === 0) return;
        const user = userList[0];

        const tunnelBindingList = await getTunnelBinding.run({ id: id }, client);
        if (tunnelBindingList.length === 0) return;
        const tunnelBinding = tunnelBindingList[0];

        const serviceList = await getService.run({ id: tunnelBinding.service_id }, client);
        if (serviceList.length === 0) return;
        const service = serviceList[0];
        if (service.user_id !== user.id) return;

        // session is validated after this point

        // get the users identities and remove the dial roles
        const identities = await getUserIdentities.run({ user_id: user.id }, client);
        identities.forEach(async i => {
            const zitiIdentityData = await getIdentity(i.ziti_id);
            const roleAttributes = zitiIdentityData?.roleAttributes ?? [];
            const dialRole = `${service.slug}-dial`;
            await patchIdentity({
                ziti_id: i.ziti_id,
                data: {
                    roleAttributes: roleAttributes.filter(e => e !== dialRole)
                }
            });
        });

        // remove entries from the database
        await deleteTunnelBindingDb.run({ id: tunnelBinding.id }, client);
        await deleteZitiHost.run({ id: tunnelBinding.host_id }, client);
        await deleteZitiIntercept.run({ id: tunnelBinding.intercept_id, }, client);
        await deleteZitiPolicy.run({ id: tunnelBinding.dial_policy_id }, client);
        await deleteZitiPolicy.run({ id: tunnelBinding.bind_policy_id }, client);

        // delete the configs and policies on the ziti side
        await deleteConfig(tunnelBinding.intercept_ziti_id);
        await deleteConfig(tunnelBinding.host_ziti_id);
        await deletePolicy(tunnelBinding.bind_policy_ziti_id);
        await deletePolicy(tunnelBinding.dial_policy_ziti_id);
    } catch (err) {
        console.error(err);
    }
}
