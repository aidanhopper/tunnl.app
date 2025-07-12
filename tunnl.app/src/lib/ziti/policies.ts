import { del, get, patch, post } from './methods';
import { GetPolicyResponse, PatchPolicyData, PostPolicyData, PostPolicyResponse } from './types';

export const getPolicy = async (ziti_id: string) => {
    return await get<GetPolicyResponse>({
        route: `/service-policies/${ziti_id}`
    });
}

export const postPolicy = async (data: PostPolicyData) => {
    return await post<PostPolicyResponse>({
        route: '/service-policies',
        data: data
    });
}

export const deletePolicy = async (ziti_id: string) => {
    return await del({
        route: `/service-policies/${ziti_id}`
    });
}

export const patchPolicy = async ({
    data,
    ziti_id
}: {
    data: PatchPolicyData
    ziti_id: string
}) => {
    return await patch({
        route: `/service-policies/${ziti_id}`,
        data: data
    });
}
