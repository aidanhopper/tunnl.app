import ApprovalCard from "@/components/dashboard/approval-card";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import SharesTable from "@/components/dashboard/shares/shares-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";
import { Users } from "lucide-react";
import { unauthorized } from "next/navigation";

const Shares = async () => {
    const user = await new UserManager(pool).auth() || unauthorized();
    const shares = await user.getShareAccessManager().getShares();
    const sharesClientData = (await Promise.all(shares.map(e => e.getClientData())))
        .filter(e => e !== null);
    return (
        <DashboardLayout>
            <div className='flex flex-col gap-8'>
                <div className='flex'>
                    <div className='flex flex-1 w-full items-center gap-8'>
                        <Users size={48} />
                        <h1>Shares</h1>
                    </div>
                </div>
                {!user.isApproved() &&
                    <ApprovalCard
                        email={user.getEmail()} />}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Shares List
                        </CardTitle>
                        <CardDescription>
                            This is where your shares will be when you join them
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SharesTable shares={sharesClientData} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout >
    );
}

export default Shares;
