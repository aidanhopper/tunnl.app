'use server';

import { getTunnelBinding } from "@/db/types/tunnel_bindings.queries";
import { deleteZitiHost } from "@/db/types/ziti_hosts.queries";
import { deleteZitiIntercept } from "@/db/types/ziti_intercepts.queries";
import { deleteZitiPolicy } from "@/db/types/ziti_policies.queries";
import { deleteTunnelBinding as deleteTunnelBindingDb} from "@/db/types/tunnel_bindings.queries"
import client from "@/lib/db";

export const deleteTunnelBinding = async (id: string) => {
    const tunnelBindingList = await getTunnelBinding.run(
        {
            id: id
        },
        client
    );

    if (tunnelBindingList.length === 0) return;

    const tunnelBinding = tunnelBindingList[0];

    deleteZitiHost.run(
        {
            id: tunnelBinding.host_id
        },
        client
    );

    deleteZitiIntercept.run(
        {
            id: tunnelBinding.intercept_id,
        },
        client
    );

    deleteZitiPolicy.run(
        {
            id: tunnelBinding.dial_policy_id
        },
        client
    );

    deleteZitiPolicy.run(
        {
            id: tunnelBinding.bind_policy_id
        },
        client
    );

    deleteTunnelBindingDb.run(
        {
            id: tunnelBinding.id
        },
        client
    );

    
}
