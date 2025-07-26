'use server'

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

const createShareLink = async ({
    serviceSlug,
    expires,
    isOneTimeUse
}: {
    serviceSlug: string,
    expires: Date,
    isOneTimeUse: boolean
}) => {
    const user = await new UserManager(pool).auth();
    if (!user) return null;
    const service = await user.getServiceManager().getServiceBySlug(serviceSlug);
    if (!service) return null;
    const shareLink = await service.getShareLinkProducerManager().createShareLink({ expires, isOneTimeUse });
    if (!shareLink) return null;
    return shareLink.getClientData();
}

export default createShareLink;
