'use server'

import { getServiceByIdAndEmail } from "@/db/types/services.queries";
import client from "@/lib/db";
import { getServerSession } from "next-auth";

const createShareLink = async (service_id: string) => {
    const session = await getServerSession();
    if (!session?.user?.email) return;
    const email = session.user.email;

    const serviceList = await getServiceByIdAndEmail.run({ email: email, id: service_id }, client);
    if (serviceList.length === 0) return;
    const service = serviceList[0];

    
}

export default createShareLink;
