import { del, get, post } from './methods';
import { PostPolicyData, PostPolicyResponse } from './types';

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
