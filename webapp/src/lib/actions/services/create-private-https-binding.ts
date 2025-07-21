'use server'

import { getUserByEmail } from "@/db/types/users.queries";
import { insertPrivateHttpsBinding } from '@/db/types/private_https_bindings.queries'
import client from "@/lib/db";
import privateHttpsFormSchema from "@/lib/form-schemas/create-private-https-binding-form-schema";
import { getServerSession } from "next-auth";
import { getTunnelBinding } from "@/db/types/tunnel_bindings.queries";
import slugify from "@/lib/slugify";
import { postService } from "@/lib/ziti/services";
import { getConfigIds, postConfig } from "@/lib/ziti/configs";
import { postPolicy } from "@/lib/ziti/policies";
import * as ziti from "@/lib/ziti/identities";

const createPrivateHttpsBinding = async ({
    privateHttpsFormData,
    tunnelBindingId,
    mainDomain,
}: {
    privateHttpsFormData: unknown,
    tunnelBindingId: string,
    mainDomain: string,
}) => {
    try {
        if (mainDomain !== ".cs.tunnl.app") throw new Error("Bad main domain");

        const session = await getServerSession();
        if (!session?.user?.email) throw new Error("No user");
        const email = session.user.email;

        const userList = await getUserByEmail.run({ email: email }, client)
        if (userList.length === 0) throw new Error("No user");
        const user = userList[0];

        const tunnelBindingList = await getTunnelBinding.run({ id: tunnelBindingId }, client);
        if (tunnelBindingList.length === 0) throw new Error("No tunnel binding");
        const tunnelBinding = tunnelBindingList[0];

        if (tunnelBinding.user_id !== user.id) throw new Error("Forbidden");

        const privateHttpsData = privateHttpsFormSchema.parse(privateHttpsFormData);
        const domain = (privateHttpsData.domain + mainDomain).toLowerCase();

        const reverseProxyIdentity = await ziti.getIdentityByName("reverse-proxy");
        if (!reverseProxyIdentity) throw new Error("Need to create the reverse proxy identity")

        const serviceName = `${tunnelBinding.service_slug}-private-https`;
        const { hostV1Id, interceptV1Id } = await getConfigIds();

        if (tunnelBinding.host_forward_ports)
            throw new Error("Invalid port");

        const hostPort = tunnelBinding.intercept_port_ranges.trim();

        // Insert the host config
        const hostZitiName = serviceName + '-host-config';
        const hostZiti = await postConfig({
            name: hostZitiName,
            configTypeId: hostV1Id,
            data: {
                forwardProtocol: true,
                allowedProtocols: [
                    'tcp',
                    'udp'
                ],
                address: tunnelBinding.intercept_addresses[0],
                port: hostPort,
            },
            tags: {}
        });

        if (!hostZiti) throw new Error('Failed to post configs to Ziti');

        // insert the intercept config
        const interceptZitiName = serviceName + '-intercept-config';
        const interceptZiti = await postConfig({
            name: interceptZitiName,
            configTypeId: interceptV1Id,
            data: {
                portRanges: {
                    low: 443,
                    high: 443
                },
                protocols: [
                    'tcp',
                    'udp'
                ],
            }
        });

        if (!interceptZiti) throw new Error('Failed to post configs to Ziti');

        const serviceData = await postService({
            name: serviceName,
            encryptionRequired: true,
            configs: [
                interceptZiti.data.id,
                hostZiti.data.id
            ]
        });

        if (!serviceData) throw new Error("Failed to post service data");

        // Create the dial policy
        const dialPolicyZitiName = serviceName + '-dial-policy';
        const dialPolicyZiti = await postPolicy({
            type: 'Dial',
            name: dialPolicyZitiName,
            semantic: 'AnyOf',
            serviceRoles: [
                `@${serviceData.data.id}`
            ],
            identityRoles: [
                `#${serviceName}-dial`
            ],
            postureCheckRoles: [],
        });

        if (!dialPolicyZiti) throw new Error('Failed to post dial policy to Ziti');

        // Create the bind policy
        const bindPolicyZitiName = serviceName + '-bind-policy';
        const bindPolicyZiti = await postPolicy({
            type: 'Bind',
            name: bindPolicyZitiName,
            semantic: 'AnyOf',
            serviceRoles: [
                `@${serviceData.data.id}`,
            ],
            identityRoles: [
                `@${reverseProxyIdentity.id}`
            ],
            postureCheckRoles: [],
        });

        if (!bindPolicyZiti) throw new Error('Failed to post bind policy to Ziti');

        await insertPrivateHttpsBinding.run({
            tunnel_binding_id: tunnelBinding.id,
            slug: slugify("binding"),
            domain: domain
        }, client);

        // patchService()

        return false;
    } catch (err) {
        console.error(err)
        return false;
    }
}

export default createPrivateHttpsBinding;
