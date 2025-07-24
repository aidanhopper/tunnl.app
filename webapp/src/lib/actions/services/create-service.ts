'use server'

import serviceSchema from "@/lib/form-schemas/create-service-form-schema";
import { redirect } from "next/navigation";
import { UserManager } from "@/lib/models/user";
import pool from "@/lib/db";

const createService = async (formData: unknown) => {
    let slug = '';
    try {
        const user = await new UserManager(pool).auth();
        if (!user) throw new Error('Unauthorized');
        const data = serviceSchema.parse(formData);
        const service = await user.getServiceManager().createService({
            name: data.name,
            protocol: data.protocol,
        });
        if (!service) throw new Error('Failed to create service');
        slug = service.getSlug();
    } catch (err) {
        console.error(err);
        return false;
    }
    redirect(`/dashboard/services/${slug}`);
}

export default createService;
