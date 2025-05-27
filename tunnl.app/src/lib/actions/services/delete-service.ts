'use server'

import { deleteServiceByNameAndEmail } from "@/db/types/services.queries";
import client from "@/lib/db";
import { getServerSession } from "next-auth";

const deleteService = async (name: string) => {
    const session = await getServerSession();

    const email = session?.user?.email;

    if (!email) return;

    try {
        deleteServiceByNameAndEmail.run(
            {
                email: email,
                name: name
            },
            client
        );
    } catch (err) {
        console.error(err);
    }
}

export default deleteService;
