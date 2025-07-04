import { getUserIdentities } from "@/db/types/identities.queries";
import { getIdentity, patchIdentity } from "./ziti/identities";
import client from "./db";

const addDialPolicyToUserIdentities = async ({ dialRole, user_id }: { dialRole: string, user_id: string }) => {
    const identities = await getUserIdentities.run({ user_id: user_id }, client);
    await Promise.all(identities.map(async i => {
        const zitiIdentityData = await getIdentity(i.ziti_id);
        const roleAttributes = zitiIdentityData?.roleAttributes?.filter(e => e !== dialRole) ?? [];
        roleAttributes.push(dialRole);
        return await patchIdentity({
            ziti_id: i.ziti_id,
            data: {
                roleAttributes: roleAttributes
            }
        });
    }));
}

export default addDialPolicyToUserIdentities;
