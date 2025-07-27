'use server'

import pool from "@/lib/db";
import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import { UserManager } from "@/lib/models/user";
import { Play } from "next/font/google";

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
    tunnelBindingSlug,
    serviceSlug
}: {
    hostConfig: unknown,
    interceptConfig: unknown,
    tunnelBindingSlug: string,
    serviceSlug: string
}) => {
    try {
        const user = await new UserManager(pool).auth();
        if (!user) throw new Error('Unauthorized');

        const service = await user.getServiceManager().getServiceBySlug(serviceSlug);
        if (!service) throw new Error('Not found');

        const host = tunnelHostFormSchema.parse(hostConfig);
        const intercept = tunnelInterceptFormSchema.parse(interceptConfig);

        const protocol = host.protocol as 'tcp' | 'udp' | 'tcp/udp';

        const identity = await user.getIdentityManager().getIdentityBySlug(host.identity);
        if (!identity) throw new Error('Identity does not exist');

        if (intercept.portConfig.forwardPorts !== host.portConfig.forwardPorts)
            throw new Error('Error');

        await service.getTunnelBindingManager().updateTunnelBinding({
            slug: tunnelBindingSlug,
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

export default editTunnelBinding;
