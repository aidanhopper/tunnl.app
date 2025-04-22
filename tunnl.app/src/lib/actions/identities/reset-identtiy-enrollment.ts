'use server'

import * as ziti from '@/lib/ziti/identities';

const resetIdentityEnrollment = async (name: string) => {
    await ziti.resetIdentityEnrollment(name);
}

export default resetIdentityEnrollment;
