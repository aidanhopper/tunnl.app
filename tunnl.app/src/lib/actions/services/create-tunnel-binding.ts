'use server'

import { getServiceBySlug, getUserServiceAndIdentityBySlugs } from "@/db/types/services.queries";
import client from "@/lib/db";
import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import tunnelShareFormSchema from "@/lib/form-schemas/tunnel-share-form-schema";
import { getConfigIds, postConfig } from "@/lib/ziti/configs";
import { postPolicy } from "@/lib/ziti/policies";
import { getServerSession } from "next-auth";

const getProtocolObject = (protocol: 'tcp' | 'udp' | 'tcp/udp') => {
    return protocol === 'tcp/udp' ? {
        forwardProtocol: true,
        allowedProtocols: [
            'tcp',
            'udp'
        ]
    } : {
        protocol: protocol,
    }
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
        const userList = await getUserServiceAndIdentityBySlugs.run(
            {
                service_slug: serviceSlug,
                identity_slug: host.identity
            },
            client
        );

        if (userList.length === 0) throw new Error('User or service or identity does not exist');
        const user = userList[0];
        if (user.email !== email) throw new Error('Forbidden');


        console.log(host);
        console.log(intercept);
        console.log(share);

        const { hostV1Id, interceptV1Id } = await getConfigIds();

        const protocol = getProtocolObject(host.protocol as 'tcp' | 'udp' | 'tcp/udp');

        const hostZitiId = await postConfig({
            name: serviceSlug + '-host-config',
            configTypeId: hostV1Id,
            data: {
                ...protocol,
                address: host.address,
                port: Number(host.port),
                portChecks: [],
                httpChecks: []
            },
            tags: {}
        });

        const interceptZitiId = await postConfig({
            name: serviceSlug + '-intercept-config',
            configTypeId: interceptV1Id,
            data: {
                portRanges: [
                    {
                        high: Number(intercept.port),
                        low: Number(intercept.port),
                    }
                ],
                addresses: [
                    intercept.address
                ],
                protocols: [
                    'tcp',
                    'udp'
                ]
            },
        })

        if (!interceptZitiId || !hostZitiId) throw new Error('Failed to post configs to Ziti');

        await postPolicy({
            type: 'Dial',
            name: serviceSlug + '-dial-policy',
            semantic: 'AnyOf',
            serviceRoles: [
                `@${user.service_ziti_id}`
            ],
            identityRoles: [
                `#${serviceSlug}-dial`
            ],
            postureCheckRoles: [],
        });

        await postPolicy({
            type: 'Bind',
            name: serviceSlug + '-bind-policy',
            semantic: 'AnyOf',
            serviceRoles: [
                `@${user.service_ziti_id}`,
            ],
            identityRoles: [
                `@${user.identity_ziti_id}`
            ],
            postureCheckRoles: [],
        })

        // TODO Attach configs to service
        // TODO If share type is automatic then share with all the users identities

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default createTunnelBinding;
