'use server'

import pool from "@/lib/db";
import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import { UserManager } from "@/lib/models/user";
import parsePortRange from "@/lib/parse-port-range";

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
