'use server'

import identitySchema from '@/lib/form-schemas/create-identity-form-schema';
import { redirect } from 'next/navigation';
import slugify from '@/lib/slugify';
import client from '@/lib/db';
import { insertIdentityByEmail } from '@/db/types/identities.queries';
import { getServerSession } from 'next-auth';
import { postIdentity } from '@/lib/ziti/identities'
import { PostIdentityData } from '@/lib/ziti/types'

const formDataToObject = (formData: FormData): Record<string, FormDataEntryValue> => {
    const obj: Record<string, FormDataEntryValue> = {};
    for (const [key, value] of formData.entries())
        obj[key] = value;
    return obj;
}

const createIdentity = async (formData: FormData) => {

    const formParse = identitySchema.safeParse(formDataToObject(formData));

    if (!formParse.success) {
        console.log(formParse.error);
        return;
    }

    const session = await getServerSession();
    if (!session?.user?.email) return;

    const email = session.user.email;
    const name = formParse.data.name;
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

    try {
        await insertIdentityByEmail.run(
            {
                email: email,
                name: name,
                slug: slug
            },
            client
        )
    } catch (err) {
        console.error(err);
        return;
    }

    redirect(`/dashboard/identities/${slug}`);
}

export default createIdentity;
