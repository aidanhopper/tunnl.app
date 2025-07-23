'use server'

import serviceSchema from "@/lib/form-schemas/create-service-form-schema";
import slugify from "@/lib/slugify";
import { getServerSession } from "next-auth";
import client from "@/lib/db";
import { getServiceBySlug, insertServiceByEmail } from "@/db/types/services.queries";
import { z } from "zod";
import { redirect } from "next/navigation";
import * as ziti from '@/lib/ziti/services';
import userIsApproved from "@/lib/user-is-approved";
import { Pool } from "pg";

// cass ServiceManager {
//     private pool: Pool;
//
//     constructor(pool: Pool) {
//         this.pool = pool;
//     }
//
//     async getServiceBySlug(slug: string) {
//         const client = await this.pool.connect();
//         try {
//             const result = await getServiceBySlug.run({ slug }, client);
//             return result[0] || null;
//         } finally {
//             client.release();
//         }
//     }
// }

const createService = async (formData: unknown) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) return;
        const email = session.user.email;
        if (!await userIsApproved(email)) throw new Error('Forbidden');

        const data = serviceSchema.parse(formData);
        const c = await client.connect();

        const slug = slugify(name);

        // // TODO Might want to change post service to return the ziti_id
        // // to avoid having to use setTimeout to delay
        // ziti.postService({
        //     encryptionRequired: true,
        //     name: slug
        // });
        //
        // await new Promise(resolve => setTimeout(resolve, 100));
        //
        // const service = await ziti.getServiceByName(slug);
        // if (!service) return;

        // await insertServiceByEmail.run(
        //     {
        //         email: email,
        //         name: name,
        //         slug: slug,
        //         ziti_id: service.id,
        //         protocol: formData.protocol,
        //     },
        //     client
        // );
        redirect(`/dashboard/services/${slug}`);
    } catch (err) {
        return;
    }

}

export default createService;
