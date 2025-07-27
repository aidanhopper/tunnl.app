'use server'

import pool from "@/lib/db";
import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import { UserManager } from "@/lib/models/user";

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
        const user = await new UserManager(pool).auth();
        if (!user) throw new Error('Unauthorized');
        const service = await user.getServiceManager().getServiceBySlug(serviceSlug);
        if (!service) throw new Error('Service not found');

        const host = tunnelHostFormSchema.parse(hostConfig);
        const intercept = tunnelInterceptFormSchema.parse(interceptConfig);

        const protocol = host.protocol as 'tcp' | 'udp' | 'tcp/udp';

        const identity = await user.getIdentityManager().getIdentityBySlug(host.identity);
        if (!identity) throw new Error('Identity does not exist');

        if (intercept.portConfig.forwardPorts !== host.portConfig.forwardPorts)
            throw new Error('Error');

        return await service.getTunnelBindingManager().createTunnelBinding({
            host: {
                protocol: protocol,
                address: host.address,
                zitiIdentityId: identity.getZitiId(),
                portConfig: host.portConfig.forwardPorts ? {
                    forwardPorts: true,
                    portRange: parsePortRange(host.portConfig.portRange)
                } : {
                    forwardPorts: false,
                    port: host.portConfig.port
                }
            },
            intercept: {
                address: intercept.address,
                portConfig: intercept.portConfig.forwardPorts ? {
                    forwardPorts: true,
                    portRange: parsePortRange(host.portConfig.forwardPorts ? host.portConfig.portRange : '')
                } : {
                    forwardPorts: false,
                    port: intercept.portConfig.port
                }
            }
        });
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default createTunnelBinding;
