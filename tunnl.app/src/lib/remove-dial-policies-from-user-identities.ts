import { getUserIdentities } from "@/db/types/identities.queries";
import client from "./db";
import { getIdentity, patchIdentity } from "./ziti/identities";

const removeDialPoliciesFromUserIdentities = async ({ dialRole, user_id }: { dialRole: string, user_id: string }) => {
    const identities = await getUserIdentities.run({ user_id: user_id }, client);
    await Promise.all(identities.map(async i => {
        const zitiIdentityData = await getIdentity(i.ziti_id);
        const roleAttributes = zitiIdentityData?.roleAttributes?.filter(e => e !== dialRole) ?? [];
        return await patchIdentity({
            ziti_id: i.ziti_id,
            data: {
                roleAttributes: roleAttributes
            }
        });
    }));
}
export default removeDialPoliciesFromUserIdentities;
