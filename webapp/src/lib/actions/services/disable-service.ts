'use server'

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

const disableService = async (serviceSlug: string) => {
    try {
        const user = await new UserManager(pool).auth()
        if (!user) throw new Error('Unauthorized');
        await user.getServiceManager().disableServiceBySlug(serviceSlug);
        const service = await user.getServiceManager().getServiceBySlug(serviceSlug);
        if (!service) throw new Error('Service not found');
        await service.getShareGrantManager().updateZitiDialRoles()
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}


export default disableService;
