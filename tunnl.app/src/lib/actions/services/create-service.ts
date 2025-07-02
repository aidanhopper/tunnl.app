'use server'

import serviceSchema from "@/lib/form-schemas/create-service-form-schema";
import slugify from "@/lib/slugify";
import { getServerSession } from "next-auth";
import client from "@/lib/db";
import { insertServiceByEmail } from "@/db/types/services.queries";
import { z } from "zod";
import { redirect } from "next/navigation";
import * as ziti from '@/lib/ziti/services';

const createService = async (formData: z.infer<typeof serviceSchema>) => {
    const session = await getServerSession();
    if (!session?.user?.email) return;
    const email = session.user.email;

    const name = formData.name;
    const slug = slugify(name);

    // TODO Might want to change post service to return the ziti_id
    // to avoid having to use setTimeout to delay
    ziti.postService({
        encryptionRequired: true,
        name: slug
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    const service = await ziti.getServiceByName(slug);
    if (!service) return;

    try {
        await insertServiceByEmail.run(
            {
                email: email,
                name: name,
                slug: slug,
                ziti_id: service.id,
                protocol: formData.protocol,
            },
            client
        );
    } catch (err) {
        ziti.deleteService(service.id);
        console.error(err);
        return;
    }

    redirect(`/dashboard/services/${slug}`);
}

export default createService;
