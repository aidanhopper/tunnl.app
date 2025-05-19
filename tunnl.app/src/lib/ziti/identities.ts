import { get, post, del } from './methods';
import { EnrollmentListResponse, IdentityListResponse, PostIdentityData } from './types';

export const getIdentityByName = async (name: string) => {
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

export const deleteIdentityByName = async (name: string) => {
    const identity = await getIdentityByName(name);
    if (!identity) return true;
    const id = identity.id;
    return await del({ route: `/identities/${encodeURIComponent(id)}` });
}

export const deleteIdentity = async (ziti_id: string) => {
    return await del({ route: `/identities/${encodeURIComponent(ziti_id)}` });
}
