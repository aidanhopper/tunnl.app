import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { HelpingHand } from "lucide-react";
import Link from "next/link";

const Services = () => {
    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-8'>
                    <HelpingHand size={48} />
                    <h1>Services</h1>
                </div>
                <div className='flex justify-end items-center'>
                    <Button className='cursor-pointer' variant='link' asChild>
                        <Link href='#'>
                            Create a service
                        </Link>
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Services;