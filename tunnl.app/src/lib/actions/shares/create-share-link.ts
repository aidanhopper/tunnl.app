'use server'

import { getServiceByIdAndEmail } from "@/db/types/services.queries";
import { createShareLinkByServiceId } from "@/db/types/share_links.queries";
import createShareLinkSlug from "@/lib/create-share-link-slug";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound, unauthorized } from "next/navigation";

const createShareLink = async (service_id: string) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) unauthorized();
        const email = session.user.email;

        const serviceList = await getServiceByIdAndEmail.run({ email: email, id: service_id }, client);
        if (serviceList.length === 0) notFound();
        const service = serviceList[0];

        const shareLinkList = await createShareLinkByServiceId.run({
            service_id: service.id,
            slug: createShareLinkSlug(),
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }, client);

        if (shareLinkList.length === 0) throw new Error('Failed to insert share link');
        const shareLink = shareLinkList[0];
        return {
            slug: shareLink.slug,
            expires: shareLink.expires
        };
    } catch (err) {
        console.error(err);
        return null;
    }
}

export default createShareLink;
