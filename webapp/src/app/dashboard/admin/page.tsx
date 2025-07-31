import UserApprover from "@/components/dashboard/admin/user-approver";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
            <div className='mt-10 flex justify-center'>
                <Card className='max-w-xl w-full'>
                    <CardHeader>
                        <CardTitle>Approve a user</CardTitle>
                        <CardDescription>Search for users to approve or unapprove</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserApprover
                            searchUser={async (email: string) => {
                                'use server'
                                return (await new UserManager(pool).getUserByEmail(email))?.getClientData() ?? null;
                            }}
                            approveUser={async (email: string) => {
                                'use server'
                                const userManager = new UserManager(pool);
                                const res = await userManager.approveUserByEmail(email);
                                if (res) {
                                    const user = await userManager.getUserByEmail(email);
                                    if (!user) return res;
                                    await user.getShareAccessManager().updateZitiDialRoles()
                                    const services = await user.getServiceManager().getServices();
                                    await Promise.all(services.map(async service => {
                                        await service.getShareGrantManager().updateZitiDialRoles();
                                    }));
                                }
                                return res;
                            }}
                            unapproveUser={async (email: string) => {
                                'use server'
                                const userManager = new UserManager(pool);
                                const res = await userManager.unapproveUserByEmail(email);
                                if (res) {
                                    const user = await userManager.getUserByEmail(email);
                                    if (!user) return res;
                                    await user.getShareAccessManager().updateZitiDialRoles()
                                    const services = await user.getServiceManager().getServices();
                                    await Promise.all(services.map(async service => {
                                        await service.getShareGrantManager().updateZitiDialRoles();
                                    }));
                                }
                                return res;
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default AdminPage;
