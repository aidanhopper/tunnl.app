'use server'

import identitySchema from '@/lib/form-schemas/create-identity-form-schema';
import { redirect } from 'next/navigation';
import slugify from '@/lib/slugify';
import client from '@/lib/db';
import { insertIdentityByEmail } from '@/db/types/identities.queries';
import { getServerSession } from 'next-auth';
import { deleteIdentityByName, postIdentity } from '@/lib/ziti/identities'
import { PostIdentityData } from '@/lib/ziti/types'
import { z } from 'zod';
import { getAutomaticallySharedTunnelBindingSlugsByEmail } from '@/db/types/tunnel_bindings.queries';
import dialRole from '@/lib/ziti/dial-role';

const createIdentity = async (formData: z.infer<typeof identitySchema>) => {
    const session = await getServerSession();
    if (!session?.user?.email) return;

    const email = session.user.email;
    const name = formData.name
    const slug = slugify(name);

    try {
        const slugs = await getAutomaticallySharedTunnelBindingSlugsByEmail
            .run({ email: email }, client);

        const data: PostIdentityData = {
            name: slug,
            type: 'Default',
            isAdmin: false,
            roleAttributes: slugs.map(e => dialRole(e.slug)),
            enrollment: {
                ott: true,
            }
        }

        const identity = await postIdentity(data);
        if (!identity) throw new Error('Could not post identity');

        await insertIdentityByEmail.run(
            {
                email: email,
                name: name,
                slug: slug,
                ziti_id: identity.data.id
            },
            client
        );
    } catch (err) {
        await deleteIdentityByName(slug);
        console.error(err);
        return;
    }

    redirect(`/dashboard/identities/${slug}`);
}

export default createIdentity;
