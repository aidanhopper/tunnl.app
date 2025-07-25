'use server'

import { updateZitiHost } from "@/db/types/ziti_hosts.queries";
import { updateZitiIntercept } from "@/db/types/ziti_intercepts.queries";
import client from "@/lib/db";
import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import { patchConfig } from "@/lib/ziti/configs";
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

const editTunnelBinding = async ({
    hostConfig,
    interceptConfig,
    tunnelBindingId
}: {
    hostConfig: unknown,
    interceptConfig: unknown,
    tunnelBindingId: string
}) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) return;
        const email = session.user.email;

        const bindingList = await getTunnelBinding.run({ id: tunnelBindingId }, client);
        if (bindingList.length === 0) throw new Error('Binding does not exist');
        const binding = bindingList[0];

        if (binding.user_email !== email) throw new Error('Forbidden');

        // session is validated after this point

        const host = tunnelHostFormSchema.parse(hostConfig);
        const intercept = tunnelInterceptFormSchema.parse(interceptConfig);

        const proto = host.protocol as 'tcp' | 'udp' | 'tcp/udp';

        // patch the host config
        await patchConfig({
            ziti_id: binding.host_ziti_id,
            data: {
                data: {
                    ...(proto === 'tcp/udp' ? {
                        forwardProtocol: true,
                        allowedProtocols: [
                            'tcp',
                            'udp'
                        ]
                    } : {
                        protocol: proto,
                    }),
                    address: host.address,
                    ...(host.portConfig.forwardPorts ? {
                        forwardPort: true,
                        allowedPortRanges: parsePortRange(host.portConfig.portRange)
                    } : {
                        port: Number(host.portConfig.port)
                    }),
                },
            },
        });

        // patch the intercept config
        await patchConfig({
            ziti_id: binding.intercept_ziti_id,
            data: {
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
                }
            }
        });

        // update the host configs table
        await updateZitiHost.run({
            id: binding.host_id,
            ziti_id: binding.host_ziti_id,
            address: host.address,
            ...(proto === 'tcp/udp' ? {
                forward_protocol: true,
                protocol: undefined
            } : {
                forward_protocol: false,
                protocol: proto,
            }),
            port: host.portConfig.forwardPorts ? undefined : host.portConfig.port,
            allowed_port_ranges: host.portConfig.forwardPorts ? host.portConfig.portRange : undefined,
            forward_ports: host.portConfig.forwardPorts
        }, client);

        // update the intercept configs table
        await updateZitiIntercept.run({
            id: binding.intercept_id,
            ziti_id: binding.intercept_ziti_id,
            port_ranges: host.portConfig.forwardPorts ?
                host.portConfig.portRange : !intercept.portConfig.forwardPorts ?
                    intercept.portConfig.port : '',
            addresses: [intercept.address],
            protocol: proto,
        }, client);

        const identityList = await getIdentityBySlug.run({ slug: host.identity }, client)
        if (identityList.length === 0) throw new Error('Identity does not exist');
        const identity = identityList[0];

        await patchPolicy({
            ziti_id: binding.bind_policy_ziti_id,
            data: { identityRoles: [`@${identity.ziti_id}`] }
        });

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default editTunnelBinding;
