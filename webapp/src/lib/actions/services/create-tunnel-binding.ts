'use server'

import { insertTunnelBinding } from "@/db/types/tunnel_bindings.queries";
import { insertZitiHost } from "@/db/types/ziti_hosts.queries";
import { insertZitiIntercept } from "@/db/types/ziti_intercepts.queries";
import { insertZitiPolicy } from "@/db/types/ziti_policies.queries";
import client from "@/lib/db";
import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import tunnelShareFormSchema from "@/lib/form-schemas/tunnel-share-form-schema";
import slugify from "@/lib/slugify";
import updateDialRoles from "@/lib/update-dial-roles";
import { getConfigIds, postConfig } from "@/lib/ziti/configs";
import dialRole from "@/lib/ziti/dial-role";
import { postPolicy } from "@/lib/ziti/policies";
import { patchService } from "@/lib/ziti/services";
import { assert } from "console";
import { getServerSession } from "next-auth";

const parsePortRange = (input: string) => {
    if (input.trim() === '') throw new Error('Port range cannot be empty');
    return input
        .trim()
        .split(" ")
        .filter(e => e !== '')
        .map(e => {
            const s = e.split("-");
            if (s.length === 1) return {
                high: Number(e),
                low: Number(e),
            };
            return {
                high: Number(s[1]),
                low: Number(s[0]),
            }
        });
}

// The assumption is that there can only be one ziti config and ziti intercept.
// It would be useful to allow users to have multiple intercepts in the future.
// Or another way could be to force users to create a separate service and each
// service has a single intercept/host.

const createTunnelBinding = async ({
    serviceSlug,
    hostConfig,
    interceptConfig,
    shareConfig
}: {
    serviceSlug: string
    hostConfig: unknown
    interceptConfig: unknown
    shareConfig: unknown
}) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) return;
        const email = session.user.email;

        const host = tunnelHostFormSchema.parse(hostConfig);
        const intercept = tunnelInterceptFormSchema.parse(interceptConfig);
        const share = tunnelShareFormSchema.parse(shareConfig);

        // add identity to this 
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default createTunnelBinding;
