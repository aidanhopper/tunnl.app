'use server'

import { enableServiceDb } from "@/db/types/services.queries";
import client from "@/lib/db";
import updateDialRolesForService from "@/lib/update-dial-roles-for-service";

const enableService = async (service_id: string) => {
    try {
        await enableServiceDb.run({ service_id: service_id }, client);
        updateDialRolesForService(service_id);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}


export default enableService;
