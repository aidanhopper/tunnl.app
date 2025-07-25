'use server';

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

export const deleteTunnelBinding = async ({
    serviceSlug,
    tunnelBindingSlug,
}: {
    serviceSlug: string,
    tunnelBindingSlug: string,
}) => {
    const user = await new UserManager(pool).auth();
    if (!user) throw new Error('Unauthorized');
    const service = await user.getServiceManager().getServiceBySlug(serviceSlug);
    if (!service) throw new Error('Service not found');
    return await service.getTunnelBindingManager().deleteTunnelBindingBySlug(tunnelBindingSlug);
}
