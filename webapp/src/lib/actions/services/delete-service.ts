'use server'

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

const deleteService = async (slug: string) => {
    const user = await new UserManager(pool).auth();
    if (!user) return false;
    const ret = await user.getServiceManager().deleteServiceBySlug(slug);
    await user.getShareAccessManager().updateZitiDialRoles();
    return ret;
}

export default deleteService;
