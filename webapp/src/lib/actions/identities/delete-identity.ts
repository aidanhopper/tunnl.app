'use server'

import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";

const deleteIdentity = async (id: string) => {
    const user = await new UserManager(pool).auth()
    if (!user) throw new Error("Unauthorized");
    
}

export default deleteIdentity;
