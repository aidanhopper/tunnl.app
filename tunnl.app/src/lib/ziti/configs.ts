import { get, post, del } from './methods';
import { ConfigTypeListResponse, PostConfigData } from './types';

let configTypes: ConfigTypeListResponse | null = null;

export const postConfig = async (data: PostConfigData) => {
    return await post({
        route: '/configs',
        data: data
    });
}

export const getConfigTypes = async () => {
    if (configTypes) return configTypes;
    configTypes = await get<ConfigTypeListResponse>({ route: '/config-types' });
    return configTypes;
}
