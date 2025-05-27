'use server'

import serviceSchema from "@/lib/form-schemas/create-service-form-schema";
import slugify from "@/lib/slugify";
import { getServerSession } from "next-auth";
import client from "@/lib/db";
import { insertServiceByEmail } from "@/db/types/services.queries";
import { z } from "zod";
import { redirect } from "next/navigation";

const createService = async (formData: z.infer<typeof serviceSchema>) => {
    const session = await getServerSession();
    if (!session?.user?.email) return;

    const email = session.user.email;
    const name = formData.name;
    const slug = slugify(name);

    try {
        await insertServiceByEmail.run(
            {
                email: email,
                name: name,
                slug: slug,
                ziti_id: 'abc',
                protocol: formData.protocol
            },
            client
        );
    } catch (err) {
        console.error(err);
        return;
    }

    redirect(`/dashboard/services/${slug}`);
}

export default createService;
