import DashboardLayout from "@/components/dashboard/dashboard-layout";
import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";
import { forbidden, unauthorized } from "next/navigation";

const AdminPage = async () => {
    const user = await new UserManager(pool).auth() || unauthorized();
    if (!user.isAdmin()) forbidden();
    return (
        <DashboardLayout>
            Hello!
        </DashboardLayout>
    );
}

export default AdminPage;
