'use server'

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

const deleteShareLink = async ({
    serviceSlug,
    shareLinkSlug
}: {
    serviceSlug: string,
    shareLinkSlug: string
}) => {
    const user = await new UserManager(pool).auth();
    if (!user) return false;
    const service = await user.getServiceManager().getServiceBySlug(serviceSlug);
    if (!service) return false;
    return await service.getShareLinkProducerManager().deleteShareLinkBySlug(shareLinkSlug);
}

export default deleteShareLink;
