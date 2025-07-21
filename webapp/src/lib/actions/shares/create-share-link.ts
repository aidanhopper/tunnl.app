'use server'

import { getServiceByIdAndEmail } from "@/db/types/services.queries";
import { createShareLinkByServiceId } from "@/db/types/share_links.queries";
import slug from "@/lib/slug";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound, unauthorized } from "next/navigation";

const createTunnelBindingShareLink = async ({
    service_id,
    expires,
    isOneTimeUse
}: {
    service_id: string,
    expires: Date,
    isOneTimeUse: boolean
}) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) unauthorized();
        const email = session.user.email;

        const now = new Date();
        const diffInMs = expires.getTime() - now.getTime();
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const isLessThan7DaysFromNow = diffInMs < sevenDaysInMs && diffInMs > 0;
        if (!isLessThan7DaysFromNow) throw new Error('Expiration date is too far out');

        const serviceList = await getServiceByIdAndEmail.run({ email: email, id: service_id }, client);
        if (serviceList.length === 0) notFound();
        const service = serviceList[0];

        const shareLinkList = await createShareLinkByServiceId.run({
            service_id: service.id,
            slug: slug(),
            expires: expires,
            one_time_use: isOneTimeUse
        }, client);

        if (shareLinkList.length === 0) throw new Error('Failed to insert share link');
        const shareLink = shareLinkList[0];
        return {
            slug: shareLink.slug,
            expires: shareLink.expires,
            isOneTimeUse: shareLink.one_time_use,
        };
    } catch (err) {
        console.error(err);
        return null;
    }
}

export default createTunnelBindingShareLink;
