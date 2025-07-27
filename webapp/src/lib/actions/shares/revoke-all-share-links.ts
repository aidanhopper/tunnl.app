'use server'

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

const revokeAllShareLinks = async (serviceSlug: string) => {
    const user = await new UserManager(pool).auth();
    if (!user) return false;
    const service = await user.getServiceManager().getServiceBySlug(serviceSlug);
    if (!service) return false;
    return service.getShareLinkProducerManager().deleteShareLinks();
}

export default revokeAllShareLinks;
