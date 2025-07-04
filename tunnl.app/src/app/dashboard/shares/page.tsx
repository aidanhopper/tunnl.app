import DashboardLayout from "@/components/dashboard/dashboard-layout";
import SharesTable from "@/components/dashboard/shares/shares-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import Link from "next/link";

const Shares = async () => {
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
                    <SharesTable />
                </CardContent>
            </Card>
        </DashboardLayout >
    )
}

export default Shares;
