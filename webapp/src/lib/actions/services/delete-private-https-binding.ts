import { deletePrivateHttpsBindingDb, getPrivateHttpsBinding } from "@/db/types/private_https_bindings.queries";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import * as zitiServices from '@/lib/ziti/services';
import * as zitiConfigs from '@/lib/ziti/configs';
import * as zitiPolicies from '@/lib/ziti/policies';

const deletePrivateHttpsBinding = async (id: string) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) throw new Error("Unauthorized");
        const email = session.user.email;

        const privateHttpsBindingList = await getPrivateHttpsBinding.run({ id: id }, client);
        if (privateHttpsBindingList.length === 0) throw new Error("Not found");
        const privateHttpsBinding = privateHttpsBindingList[0];

        if (privateHttpsBinding.email !== email) throw new Error("Forbidden");

        await zitiServices.deleteService(privateHttpsBinding.ziti_service_id);
        await zitiConfigs.deleteConfig(privateHttpsBinding.ziti_intercept_id);
        await zitiPolicies.deletePolicy(privateHttpsBinding.ziti_bind_id);
        await zitiPolicies.deletePolicy(privateHttpsBinding.ziti_dial_id);

        await deletePrivateHttpsBindingDb.run({ id: privateHttpsBinding.id }, client);

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default deletePrivateHttpsBinding;
