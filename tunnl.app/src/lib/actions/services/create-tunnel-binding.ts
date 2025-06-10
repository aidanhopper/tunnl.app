'use server'

import { getUserAndServiceByServiceSlug } from "@/db/types/services.queries";
import client from "@/lib/db";
import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import { getConfigTypes, postConfig } from "@/lib/ziti/configs";
import { getServerSession } from "next-auth";

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
        const session = await getServerSession();
        if (!session?.user?.email) return;
        const email = session.user.email;

        const userList = await getUserAndServiceByServiceSlug.run(
            {
                slug: serviceSlug
            },
            client
        )

        if (userList.length === 0) throw new Error('User or service does not exist');
        const user = userList[0];
        if (user.email !== email) throw new Error('Forbidden');

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

        const protocol = host.protocol === 'tcp/udp' ? {
            forwardProtocol: true,
            allowedProtocols: [
                'tcp',
                'udp'
            ]
        } : {
            protocol: host.protocol,
        }

        const hostZitiId = await postConfig({
            name: serviceSlug + '-host-config',
            configTypeId: hostV1Id,
            data: {
                ...protocol,
                address: host.address,
                port: Number(host.port),
                portChecks: [],
                httpChecks: []
            },
            tags: {}
        });

        const interceptZitiId = await postConfig({
            name: serviceSlug + '-intercept-config',
            configTypeId: interceptV1Id,
            data: {
                portRanges: [
                    {
                        high: Number(intercept.port),
                        low: Number(intercept.port),
                    }
                ],
                addresses: [
                    intercept.address
                ],
                protocols: [
                    'tcp',
                    'udp'
                ]
            },
        })

        if (!interceptZitiId || !hostZitiId) throw new Error('Failed to post configs to Ziti');

        console.log('intercept', interceptZitiId?.data.id);
        console.log('host', hostZitiId?.data.id);

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default createTunnelBinding;
