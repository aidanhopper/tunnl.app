import { del, get, post, patch } from './methods';
import { PatchServiceData, PostServiceData, PostServiceResponse, Service, ServiceListResponse } from './types';

export const postService = async (data: PostServiceData) => {
    return await post<PostServiceResponse>({
        route: '/services',
        data: data
    });
}

export const patchService = async ({ ziti_id, data }: { ziti_id: string, data: PatchServiceData }) => {
    return await patch({
        route: `/services/${encodeURIComponent(ziti_id)}`,
        data: data
    });
}

export const getServiceByName = async (name: string) => {
    const r = await get<ServiceListResponse>({
        route: '/services',
        filter: `name="${name}"`
    });

    if (!r || r.data.length === 0) return null;

    return r.data[0];
}

export const getService = async (ziti_id: string) => {
    return await get<Service>({ route: `/identities/${encodeURIComponent(ziti_id)}` });
}

export const deleteService = async (ziti_id: string) => {
    return await del({ route: `/services/${encodeURIComponent(ziti_id)}` });
}
