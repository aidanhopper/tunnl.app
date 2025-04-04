import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Home } from "lucide-react";

const Dashboard = () => {
    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-8'>
                    <Home size={48} />
                    <h1>Home</h1>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;