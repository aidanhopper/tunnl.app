import { getUserIdentities } from "@/db/types/identities.queries";
import { patchIdentity } from "./ziti/identities";
import client from "./db";
import { getShareServiceSlugs } from "@/db/types/shares.queries";
import { getAutomaticallySharedTunnelBindings } from "@/db/types/tunnel_bindings.queries";
import dialRole from "./ziti/dial-role";

const updateDialRoles = async (user_id: string) => {
    const _slugs1 = (await getShareServiceSlugs.run({ user_id: user_id }, client)).map(e => e.slug);
    const _slugs2 = (await getAutomaticallySharedTunnelBindings.run({ user_id: user_id }, client)).map(e => e.slug);
    const slugs = [..._slugs1, ..._slugs2];
    const roleAttributes = slugs.map(dialRole);
    const identities = await getUserIdentities.run({ user_id: user_id }, client);
    await Promise.all(identities.map(async i => {
        return await patchIdentity({
            ziti_id: i.ziti_id,
            data: { roleAttributes: roleAttributes }
        });
    }));
}

export default updateDialRoles;
