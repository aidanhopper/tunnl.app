'use server'

import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import { getConfigTypes, postConfig } from "@/lib/ziti/configs";

const createTunnelBinding = async ({
    serviceSlug,
    hostConfig,
    interceptConfig
}: {
    serviceSlug: string
    hostConfig: unknown
    interceptConfig: unknown
}) => {
    try {
        const host = tunnelHostFormSchema.parse(hostConfig);
        const intercept = tunnelInterceptFormSchema.parse(interceptConfig);

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

        await postConfig({
            configTypeId: hostV1Id,
            name: serviceSlug + '-host-config',
            data: {
                
            }
        });

        // await postConfig({
        //     configTypeId: interceptV1Id,
        //     name: serviceSlug + '-intercept-config',
        //     data: {}
        // })

    } catch (err) {
        console.error(err);
    }
}

export default createTunnelBinding;
