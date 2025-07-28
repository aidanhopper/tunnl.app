'use server'

import pool from '@/lib/db';
import identitySchema from '@/lib/form-schemas/create-identity-form-schema';
import { UserManager } from '@/lib/models/user';
import { redirect } from 'next/navigation';

const createIdentity = async (formData: unknown) => {
    let slug = '';
    try {
        const user = await new UserManager(pool).auth();
        if (!user) throw new Error('Unauthorized');

        const data = identitySchema.parse(formData);

        const identity = await user.getIdentityManager().createIdentity(data.name);
        if (!identity) throw new Error('Failed to create identity');

        slug = identity.getSlug();

        const shares = await user.getShareAccessManager().getShares();
        await Promise.all(shares.map(async share => {
            await user.getShareAccessManager().addIdentityToShare({
                identitySlug: slug,
                shareSlug: share.getSlug()
            });
        }));
        await user.getShareAccessManager().updateZitiDialRoles();
    } catch (err) {
        console.error(err);
        return false;
    }
    redirect(`/dashboard/identities/${slug}`);
}

export default createIdentity;
