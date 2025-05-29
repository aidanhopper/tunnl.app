'use server'

import { deleteServiceByNameAndEmail, getServiceByNameAndEmail } from "@/db/types/services.queries";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import * as ziti from '@/lib/ziti/services';

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

    ziti.getService(service.ziti_id)

    try {
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
