'use server'

import { getServiceByIdAndEmail } from "@/db/types/services.queries";
import { deleteAllServicesShareLinks } from "@/db/types/share_links.queries";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { unauthorized } from "next/navigation";

const revokeAllShareLinks = async (service_id: string) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) unauthorized();
        const email = session.user.email;

        const serviceList = await getServiceByIdAndEmail.run({ id: service_id, email: email }, client);
        if (serviceList.length === 0) throw new Error('Service not found');

        // session validated after this point

        await deleteAllServicesShareLinks.run({ service_id: service_id }, client);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default revokeAllShareLinks;
