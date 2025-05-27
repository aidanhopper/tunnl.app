'use server'

import identitySchema from '@/lib/form-schemas/create-identity-form-schema';
import { redirect } from 'next/navigation';
import slugify from '@/lib/slugify';
import client from '@/lib/db';
import { insertIdentityByEmail } from '@/db/types/identities.queries';
import { getServerSession } from 'next-auth';
import { deleteIdentityByName, getIdentityByName, postIdentity } from '@/lib/ziti/identities'
import { PostIdentityData } from '@/lib/ziti/types'
import { z } from 'zod';

const createIdentity = async (formData: z.infer<typeof identitySchema>) => {
    const session = await getServerSession();
    if (!session?.user?.email) return;

    const email = session.user.email;
    const name = formData.name
    const slug = slugify(name);

    const data: PostIdentityData = {
        name: slug,
        type: 'Default',
        isAdmin: false,
        enrollment: {
            ott: true,
        }
    }

    if (!(await postIdentity(data))) return;

    const zitiIdentity = await getIdentityByName(slug)
    if (!zitiIdentity) return;

    try {
        await insertIdentityByEmail.run(
            {
                email: email,
                name: name,
                slug: slug,
                ziti_id: zitiIdentity.id
            },
            client
        )
    } catch (err) {
        await deleteIdentityByName(slug);
        console.error(err);
        return;
    }

    redirect(`/dashboard/identities/${slug}`);
}

export default createIdentity;
