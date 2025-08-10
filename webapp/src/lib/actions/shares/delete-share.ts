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
        const share = await service.getShareGrantManager().getShareBySlug(shareSlug);
        if (!share) return false;
        const ret = await service.getShareGrantManager().deleteShareBySlug(shareSlug);
        const grantee = await new UserManager(pool).getUserById(share.getUserId());
        if (!grantee) return false;
        await grantee.getShareAccessManager().updateZitiDialRoles();
        return ret;
    } else {
        const ret = await user.getShareAccessManager().deleteShareBySlug(shareSlug);
        if (ret) await user.getShareAccessManager().updateZitiDialRoles();
        return ret;
    }
}

export default deleteShare;
