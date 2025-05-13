'use server'

import * as ziti from '@/lib/ziti/identities';
import { PostIdentityData } from '@/lib/ziti/types';

const resetIdentityEnrollment = async (name: string) => {
    await ziti.deleteIdentity(name);
    const data: PostIdentityData = {
        name: name,
        type: 'Default',
        isAdmin: false,
        enrollment: {
            ott: true,
        }
    }
    await ziti.postIdentity(data);
}

export default resetIdentityEnrollment;
