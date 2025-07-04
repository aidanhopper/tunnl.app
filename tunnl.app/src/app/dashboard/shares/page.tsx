import DashboardLayout from "@/components/dashboard/dashboard-layout";
import SharesTable from "@/components/dashboard/shares/shares-table";
import { Card, CardContent } from "@/components/ui/card";
import { getSharesByEmail } from "@/db/types/shares.queries";
import client from "@/lib/db";
import { Users } from "lucide-react";
import { getServerSession } from "next-auth";
import { unauthorized } from "next/navigation";

const Shares = async () => {
    const session = await getServerSession();
    const email = session?.user?.email;
    if (!email) unauthorized();

    const shares = await getSharesByEmail.run({ email: email }, client);
    console.log(shares);

    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 w-full items-center gap-8'>
                    <Users size={48} />
                    <h1>Shares</h1>
                </div>
            </div>
            <Card className='mt-10'>
                <CardContent>
                    <SharesTable shares={shares} />
                </CardContent>
            </Card>
        </DashboardLayout >
    )
}

export default Shares;
