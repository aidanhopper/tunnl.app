import Broadcast from "@/components/dashboard/admin/broadcast";
import UserApprover from "@/components/dashboard/admin/user-approver";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import broadcast from "@/lib/actions/admin/broadcast";
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
            <div className='mt-10 flex flex-col items-center gap-8'>
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
                <Card className='max-w-xl w-full'>
                    <CardHeader>
                        <CardTitle>Broadcast</CardTitle>
                        <CardDescription>Broadcast new message for every user to see</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Broadcast onClick={async (msg: string) => {
                            'use server'
                            await broadcast(msg);
                        }} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default AdminPage;
