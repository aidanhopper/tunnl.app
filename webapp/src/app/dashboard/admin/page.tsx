import DashboardLayout from "@/components/dashboard/dashboard-layout";
import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";
import { ShieldUser } from "lucide-react";
import { forbidden, unauthorized } from "next/navigation";

const AdminPage = async () => {
    const user = await new UserManager(pool).auth() || unauthorized();
    if (!user.isAdmin()) forbidden();
    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-8'>
                    <ShieldUser size={48} />
                    <h1>Admin Settings</h1>
                </div>
            </div>
            <div className='mt-10 flex flex-col lg:flex-row gap-10'>
                <p>
                    Private https reverse proxy enrollment
                </p>
                <p>
                    User approver 
                </p>
            </div>
        </DashboardLayout>
    );
}

export default AdminPage;
