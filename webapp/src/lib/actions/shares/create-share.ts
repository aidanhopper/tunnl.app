'use server'

import { deleteShareLink, getShareLinkBySlug } from "@/db/types/share_links.queries";
import { insertShareByEmail } from "@/db/types/shares.queries";
import { getTunnelBinding } from "@/db/types/tunnel_bindings.queries";
import client from "@/lib/db";
import updateDialRoles from "@/lib/update-dial-roles";
import { getServerSession } from "next-auth";
import { unauthorized } from "next/navigation";

const createShare = async (shareLinkSlug: string) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) unauthorized();
        const email = session.user.email;

        const userList = await getUserByEmail.run({ email: email }, client);
        if (userList.length === 0) unauthorized();
        const user = userList[0];

        const shareLinkList = await getShareLinkBySlug.run({ slug: shareLinkSlug }, client);
        if (shareLinkList.length === 0) throw new Error('Error getting share link');
        const shareLink = shareLinkList[0];

        const tunnelBindingList = await getTunnelBinding.run({ id: shareLink.tunnel_binding_id }, client);
        if (tunnelBindingList.length === 0) throw new Error('Tunnel binding does not exist')
        const tunnelBinding = tunnelBindingList[0];
        if (tunnelBinding.dial_policy_identity_roles.length === 0) throw new Error('Dial policy does not exist');

        if (shareLink.expires < new Date()) throw new Error('Share link has expired');
        await insertShareByEmail.run({ tunnel_binding_id: shareLink.tunnel_binding_id, email: email }, client);
        await deleteShareLink.run({ id: shareLink.id }, client);

        await updateDialRoles(user.id);

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default createShare;
