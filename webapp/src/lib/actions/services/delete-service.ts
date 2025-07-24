'use server'

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

const deleteService = async (slug: string) => {
    const user = await new UserManager(pool).auth();
    if (!user) return false;
    return await user.getServiceManager().deleteServiceBySlug(slug);
}

export default deleteService;
