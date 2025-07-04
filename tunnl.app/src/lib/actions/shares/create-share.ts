'use server'

import { deleteShareLink, getShareLinkBySlug } from "@/db/types/share_links.queries";
import { insertShareByEmail } from "@/db/types/shares.queries";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { unauthorized } from "next/navigation";

const createShare = async (shareLinkSlug: string) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) unauthorized();
        const email = session.user.email;

        const shareLinkList = await getShareLinkBySlug.run({ slug: shareLinkSlug }, client);
        if (shareLinkList.length !== 0) throw new Error('Error inserting share link');
        const shareLink = shareLinkList[0];

        if (shareLink.expires < new Date()) throw new Error('Share link has expired');
        await insertShareByEmail.run({ tunnel_binding_id: shareLink.tunnel_binding_id, email: email }, client);
        await deleteShareLink.run({ id: shareLink.id }, client);

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default createShare;
