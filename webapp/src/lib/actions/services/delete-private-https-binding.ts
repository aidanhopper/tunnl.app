import { deletePrivateHttpsBindingDb, getPrivateHttpsBinding } from "@/db/types/private_https_bindings.queries";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import * as zitiServices from '@/lib/ziti/services';

const deletePrivateHttpsBinding = async (id: string) => {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) throw new Error("Unauthorized");
        const email = session.user.email;

        const privateHttpsBindingList = await getPrivateHttpsBinding.run({ id: id }, client);
        if (privateHttpsBindingList.length === 0) throw new Error("Not found");
        const privateHttpsBinding = privateHttpsBindingList[0];

        if (privateHttpsBinding.email !== email) throw new Error("Forbidden");

        const zitiService = await zitiServices.getService(privateHttpsBinding.ziti_id);

        await deletePrivateHttpsBindingDb.run({ id: privateHttpsBinding.id }, client);

        // zitiService?.terminatorStrategy
        // zitiService?.configs.forEach(e => {
        //
        // });

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export default deletePrivateHttpsBinding;
