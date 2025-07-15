import { getAllDialUsersByServiceId } from "@/db/types/shares.queries";
import client from "./db";
import updateDialRoles from "./update-dial-roles";

const updateDialRolesForService = async (service_id: string) => {
    const users = (await getAllDialUsersByServiceId.run({ service_id: service_id }, client))
        .map(e => e.user_id)
        .filter(e => e !== null);
    await Promise.all(users.map(updateDialRoles));
}

export default updateDialRolesForService;
