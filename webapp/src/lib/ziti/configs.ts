import { Play } from 'next/font/google';
import { get, post, del, patch } from './methods';
import { ConfigTypeListResponse, GetConfigResponse, PatchConfigData, PostConfigData, PostConfigResponse } from './types';

let configTypes: ConfigTypeListResponse | null = null;

export const postConfig = async (data: PostConfigData) => {
    return await post<PostConfigResponse>({
        route: '/configs',
        data: data
    });
}

export const getConfigTypes = async () => {
    if (configTypes) return configTypes;
    configTypes = await get<ConfigTypeListResponse>({ route: '/config-types' });
    return configTypes;
}

export const getConfigIds = async () => {
    const configTypes = await getConfigTypes();

    const hostV1Id = configTypes
        ?.data
        .find(configType => configType.name === 'host.v1')
        ?.id;

    const interceptV1Id = configTypes
        ?.data
        .find(configType => configType.name === 'intercept.v1')
        ?.id;

    if (!hostV1Id || !interceptV1Id) throw new Error('Could not find host.v1 or intercept.v1 config ids');

    return {
        hostV1Id: hostV1Id,
        interceptV1Id: interceptV1Id
    }
}

export const deleteConfig = async (ziti_id: string) => {
    return await del({
        route: `/configs/${ziti_id}`
    })
}

export const patchConfig = async ({
    data,
    ziti_id
}: {
    data: PatchConfigData,
    ziti_id: string
}) => {
    return await patch({
        route: `/configs/${ziti_id}`,
        data: data
    });
}

export const getConfig = async <T = Record<string, any>>(ziti_id: string) => {
    return await get<GetConfigResponse<T>>({
        route: `/configs/${ziti_id}`
    })
}

