'use server'

import { deleteIdentityByEmail, getIdentityByNameAndEmail } from "@/db/types/identities.queries"
import client from '@/lib/db';
import { getServerSession } from "next-auth";
import * as ziti from '@/lib/ziti/identities';

const deleteIdentity = async (name: string) => {
    const session = await getServerSession();

    const email = session?.user?.email;

    if (!email) return;

    const identity = await getIdentityByNameAndEmail.run(
        {
            name: name,
            email: email
        },
        client
    );

    await ziti.deleteIdentity(identity[0].ziti_id);

    await deleteIdentityByEmail.run(
        {
            name: name,
            email: email
        },
        client
    );
}

export default deleteIdentity;
