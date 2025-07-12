import { getIdentityByZitiId } from "@/db/types/identities.queries";
import { getPolicy } from "./ziti/policies";
import client from "./db";

const getHostingIdentitySlug = async (bind_policy_ziti_id: string) => {
    let hostingIdentitySlug: string | null = null;
    const policy = await getPolicy(bind_policy_ziti_id);
    if (policy?.data.identityRoles) {
        const hostingIdentityZitiId = policy.data.identityRoles[0].substring(1);
        const identityList = await getIdentityByZitiId.run({ ziti_id: hostingIdentityZitiId }, client);
        if (identityList.length !== 0)
            hostingIdentitySlug = identityList[0].slug;
    }
    return hostingIdentitySlug;
}

export default getHostingIdentitySlug;
