'use server'

import { deleteServiceByNameAndEmail, getServiceByNameAndEmail } from "@/db/types/services.queries";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import * as ziti from '@/lib/ziti/services';
import { getTunnelBindingsByServiceSlug } from "@/db/types/tunnel_bindings.queries";
import { deleteTunnelBinding } from "./delete-tunnel-binding";

const deleteService = async (name: string) => {
    const session = await getServerSession();

    const email = session?.user?.email;

    if (!email) return;
    
    const serviceList = await getServiceByNameAndEmail.run(
        {
            name: name,
            email: email
        },
        client
    );

    if (serviceList.length === 0) return;

    const service = serviceList[0];

    try {
        const tunnelBindings = await getTunnelBindingsByServiceSlug.run(
            {
                slug: service.slug
            },
            client
        );

        tunnelBindings.forEach(async e => await deleteTunnelBinding(e.id));

        deleteServiceByNameAndEmail.run(
            {
                email: email,
                name: name
            },
            client
        );

        ziti.deleteService(service.ziti_id);
    } catch (err) {
        console.error(err);
    }
}

export default deleteService;
