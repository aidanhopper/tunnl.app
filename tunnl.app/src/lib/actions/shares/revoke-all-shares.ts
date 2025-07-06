'use server'

import { getServiceByIdAndEmail } from "@/db/types/services.queries";
import { deleteAllServiceShares } from "@/db/types/shares.queries";
import client from "@/lib/db";
import updateDialRoles from "@/lib/update-dial-roles";
import { getServerSession } from "next-auth";
import { notFound, unauthorized } from "next/navigation";

const revokeAllShares = async (service_id: string) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) unauthorized();
        const email = session.user.email;

        const serviceList = await getServiceByIdAndEmail.run({ id: service_id, email: email }, client);
        if (serviceList.length === 0) notFound();

        const deletedShares = await deleteAllServiceShares.run({ service_id: service_id }, client);
        await Promise.all(deletedShares.map(e => updateDialRoles(e.user_id)));

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default revokeAllShares;
