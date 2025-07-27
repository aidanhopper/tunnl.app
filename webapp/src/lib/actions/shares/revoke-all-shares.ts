'use server'

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

const revokeAllShares = async (serviceSlug: string) => {
    const user = await new UserManager(pool) .auth();
    if (!user) return false;
    const service = await user.getServiceManager().getServiceBySlug(serviceSlug);
    if (!service) return false;
    return await service.getShareGrantManager().deleteShares();
}

export default revokeAllShares;
