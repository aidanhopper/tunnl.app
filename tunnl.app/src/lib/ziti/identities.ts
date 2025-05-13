import { get, post, del } from './methods';
import { EnrollmentListResponse, IdentityListResponse, PostIdentityData } from './types';

export const getIdentity = async (name: string) => {
    const r = await get<IdentityListResponse>({
        route: '/identities',
        filter: `name="${name}"`
    });

    if (!r || r.data.length === 0) return null;

    return r.data[0];
}

export const postIdentity = async (data: PostIdentityData) => {
    return await post({
        route: '/identities',
        data: data
    });
}

export const deleteIdentity = async (name: string) => {
    const identity = await getIdentity(name);
    if (!identity) return true;
    const id = identity.id;
    return await del({ route: `/identities/${encodeURIComponent(id)}` });
}
