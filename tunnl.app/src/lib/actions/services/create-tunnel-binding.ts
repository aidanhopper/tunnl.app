'use server'

import { getUserIdentities } from "@/db/types/identities.queries";
import { getUserServiceAndIdentityBySlugs } from "@/db/types/services.queries";
import { insertTunnelBinding } from "@/db/types/tunnel_bindings.queries";
import { insertZitiHost } from "@/db/types/ziti_hosts.queries";
import { insertZitiIntercept } from "@/db/types/ziti_intercepts.queries";
import { insertZitiPolicy } from "@/db/types/ziti_policies.queries";
import client from "@/lib/db";
import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import tunnelShareFormSchema from "@/lib/form-schemas/tunnel-share-form-schema";
import { getConfigIds, postConfig } from "@/lib/ziti/configs";
import dialRole from "@/lib/ziti/dial-role";
import { getIdentity, patchIdentity } from "@/lib/ziti/identities";
import { postPolicy } from "@/lib/ziti/policies";
import { patchService } from "@/lib/ziti/services";
import { assert } from "console";
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

        assert(host.portConfig.forwardPorts === intercept.portConfig.forwardPorts);

        console.log(host);
        console.log(intercept);
        console.log(share);

        if (host.portConfig.forwardPorts) parsePortRange(host.portConfig.portRange);

        const proto = host.protocol as 'tcp' | 'udp' | 'tcp/udp';

        // return false;

        // Create configs for the service on the ziti controller
        const { hostV1Id, interceptV1Id } = await getConfigIds();

        const protocol = getProtocolObject(proto);

        // Insert the host config
        const hostZitiName = serviceSlug + '-host-config';
        const hostZiti = await postConfig({
            name: hostZitiName,
            configTypeId: hostV1Id,
            data: {
                ...protocol,
                address: host.address,
                ...(host.portConfig.forwardPorts ? {
                    forwardPort: true,
                    allowedPortRanges: parsePortRange(host.portConfig.portRange)
                } : {
                    port: Number(host.portConfig.port)
                }),
                portChecks: [],
                httpChecks: []
            },
            tags: {}
        });

        if (!hostZiti) throw new Error('Failed to post configs to Ziti');

        const hostDb = await insertZitiHost.run(
            {
                name: hostZitiName,
                ziti_id: hostZiti.data.id,
                address: host.address,
                ...(proto === 'tcp/udp' ? {
                    forward_protocol: true,
                } : {
                    forward_protocol: false,
                    protocol: proto,
                }),
                port: host.portConfig.forwardPorts ? undefined : host.portConfig.port,
                allowed_port_ranges: host.portConfig.forwardPorts ? host.portConfig.portRange : undefined,
                forward_ports: host.portConfig.forwardPorts
            },
            client
        );

        // insert the intercept config
        const interceptZitiName = serviceSlug + '-intercept-config';
        const interceptZiti = await postConfig({
            name: interceptZitiName,
            configTypeId: interceptV1Id,
            data: {
                portRanges: parsePortRange(
                    host.portConfig.forwardPorts ?
                        host.portConfig.portRange : !intercept.portConfig.forwardPorts ?
                            intercept.portConfig.port : ''
                ),
                addresses: [
                    intercept.address
                ],
                protocols: proto === 'tcp' ? [
                    'tcp'
                ] : proto === 'udp' ? [
                    'udp'
                ] : [
                    'tcp',
                    'udp'
                ]
            },
        });

        if (!interceptZiti) throw new Error('Failed to post configs to Ziti');

        const interceptDb = await insertZitiIntercept.run(
            {
                ziti_id: interceptZiti.data.id,
                name: interceptZitiName,
                port_ranges: host.portConfig.forwardPorts ?
                    host.portConfig.portRange : !intercept.portConfig.forwardPorts ?
                        intercept.portConfig.port : '',
                addresses: [intercept.address],
                protocol: proto,
            },
            client
        );

        // Attach configs to the service
        await patchService({
            ziti_id: user.service_ziti_id,
            data: {
                configs: [
                    interceptZiti.data.id,
                    hostZiti.data.id
                ]
            }
        });

        // Create the dial policy
        const dialPolicyZitiName = serviceSlug + '-dial-policy';
        const dialPolicyZiti = await postPolicy({
            type: 'Dial',
            name: dialPolicyZitiName,
            semantic: 'AnyOf',
            serviceRoles: [
                `@${user.service_ziti_id}`
            ],
            identityRoles: [
                `#${serviceSlug}-dial`
            ],
            postureCheckRoles: [],
        });

        if (!dialPolicyZiti) throw new Error('Failed to post dial policy to Ziti');

        const dialPolicyDb = await insertZitiPolicy.run(
            {
                name: dialPolicyZitiName,
                ziti_id: dialPolicyZiti.data.id,
                type: 'Dial',
                semantic: 'AnyOf',
                service_roles: [
                    `@${user.service_ziti_id}`
                ],
                identity_roles: [
                    `#${dialRole(serviceSlug)}`
                ]
            },
            client
        );

        // Create the bind policy
        const bindPolicyZitiName = serviceSlug + '-bind-policy';
        const bindPolicyZiti = await postPolicy({
            type: 'Bind',
            name: bindPolicyZitiName,
            semantic: 'AnyOf',
            serviceRoles: [
                `@${user.service_ziti_id}`,
            ],
            identityRoles: [
                `@${user.identity_ziti_id}`
            ],
            postureCheckRoles: [],
        });

        if (!bindPolicyZiti) throw new Error('Failed to post bind policy to Ziti');

        const bindPolicyDb = await insertZitiPolicy.run(
            {
                ziti_id: bindPolicyZiti.data.id,
                name: bindPolicyZitiName,
                semantic: 'AnyOf',
                type: 'Bind',
                service_roles: [
                    `@${user.service_ziti_id}`,
                ],
                identity_roles: [
                    `@${user.identity_ziti_id}`
                ]
            },
            client
        )

        if (interceptDb.length === 0) throw new Error('intercept insert failed');
        if (hostDb.length === 0) throw new Error('host insert failed');
        if (dialPolicyDb.length === 0) throw new Error('dial insert failed');
        if (bindPolicyDb.length === 0) throw new Error('bind insert failed');

        const tunnelBindingDb = await insertTunnelBinding.run(
            {
                service_id: user.service_id,
                intercept_id: interceptDb[0].id,
                host_id: hostDb[0].id,
                dial_policy_id: dialPolicyDb[0].id,
                bind_policy_id: bindPolicyDb[0].id,
                share_automatically: share.type === 'automatic'
            },
            client
        );

        console.log(tunnelBindingDb.length !== 0 ? tunnelBindingDb[0] : 'Failed to insert tunnel binding');

        if (share.type !== 'automatic') return true;

        // get all the users identities and add dial role
        const identities = await getUserIdentities.run({ user_id: user.user_id }, client);
        identities.forEach(async i => {
            const zitiIdentityData = await getIdentity(i.ziti_id);
            const roleAttributes = zitiIdentityData?.roleAttributes ?? [];
            roleAttributes.push(dialRole(serviceSlug));
            await patchIdentity({
                ziti_id: i.ziti_id,
                data: {
                    roleAttributes: roleAttributes
                }
            });
        });

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default createTunnelBinding;
