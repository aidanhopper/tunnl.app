'use server'

import tunnelHostFormSchema from "@/lib/form-schemas/tunnel-host-form-schema";
import tunnelInterceptFormSchema from "@/lib/form-schemas/tunnel-intercept-form-schema";
import { getServerSession } from "next-auth";

const editTunnelBinding = async ({
    hostConfig,
    interceptConfig,
    tunnelBindingId
}: {
    hostConfig: unknown,
    interceptConfig: unknown,
    tunnelBindingId: string
}) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) return;
        const email = session.user.email;
        console.log(email);

        const host = tunnelHostFormSchema.parse(hostConfig);
        const intercept = tunnelInterceptFormSchema.parse(interceptConfig);

        console.log(intercept)
        console.log(host);



        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default editTunnelBinding;
