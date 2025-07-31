import { insertUpdateMessage } from "@/db/types/update_messages.queries";
import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

const broadcast = async (msg: string) => {
    const user = await new UserManager(pool).auth();
    if (!user || !user.isAdmin()) return;
    const client = await pool.connect();
    try {
        await insertUpdateMessage.run({ content: msg }, client);
    } finally {
        client.release();
    }
}

export default broadcast;
