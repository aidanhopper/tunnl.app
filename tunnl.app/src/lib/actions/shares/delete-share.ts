'use server'

import { deleteShareById } from "@/db/types/shares.queries";
import client from "@/lib/db";
import updateDialRoles from "@/lib/update-dial-roles";
import { getServerSession } from "next-auth";

const deleteShare = async (share_id: string) => {
    try {
        const session = await getServerSession();
        const email = session?.user?.email;
        if (!email) return;

        await client.query('BEGIN');

        const shares = await deleteShareById.run({ id: share_id }, client);
        if (shares.length === 0) throw new Error('Share does not exist');
        const share = shares[0];

        if (share.owner_user_email !== email
            && share.share_user_email !== email)
            throw new Error('Forbidden');

        // validated after this point
        await client.query('COMMIT');

        updateDialRoles(share.share_user_id);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
    }
}

export default deleteShare;
