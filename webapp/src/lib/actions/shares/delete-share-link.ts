'use server'

import { deleteShareLinkByIdAndEmail } from "@/db/types/share_links.queries";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { unauthorized } from "next/navigation";

const deleteShareLink = async (share_link_id: string) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) unauthorized();
        const email = session.user.email;

        const res = await deleteShareLinkByIdAndEmail.run({ email: email, share_link_id: share_link_id }, client);
        if (res.length === 0) throw new Error('Share link does not exist');

        return true;
    } catch (err) {
        console.error(err);
        return false
    }
}

export default deleteShareLink;
