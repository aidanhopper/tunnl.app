import DashboardLayout from "@/components/dashboard/dashboard-layout";
import HomeSkeleton from "@/components/dashboard/home/skeleton";
import { Home } from "lucide-react";

const Dashboard = () => {
    return (
        <DashboardLayout>
            <div className='flex flex-col gap-8'>
                <div className='flex flex-1 items-center gap-8'>
                    <Home size={48} />
                    <h1>Home</h1>
                </div>
                <HomeSkeleton />
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;
