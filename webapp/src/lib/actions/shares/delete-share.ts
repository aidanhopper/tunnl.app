'use server'

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

const deleteShare = async ({
    shareSlug,
    serviceSlug
}: {
    shareSlug: string,
    serviceSlug?: string
}) => {
    const user = await new UserManager(pool).auth();
    if (!user) return false;
    if (serviceSlug) {
        const service = await user.getServiceManager().getServiceBySlug(serviceSlug);
        if (!service) return false;
        return await service.getShareGrantManager().deleteShareBySlug(shareSlug);
    } else {
        return await user.getShareAccessManager().deleteShareBySlug(shareSlug);
    }
}

export default deleteShare;
