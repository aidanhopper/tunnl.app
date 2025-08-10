'use server'

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";
import deleteShare from "./delete-share";

const revokeAllShares = async (serviceSlug: string) => {
    const user = await new UserManager(pool).auth();
    if (!user) return false;
    const service = await user.getServiceManager().getServiceBySlug(serviceSlug);
    if (!service) return false;
    const shares = await (await service.getShareGrantManager().getShares()).unowned();
    await Promise.all(
        shares.map(async e => await deleteShare({
            serviceSlug,
            shareSlug: e.getSlug()
        }))
    );
    return true;
}

export default revokeAllShares;
