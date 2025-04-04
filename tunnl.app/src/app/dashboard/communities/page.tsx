import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { HelpingHand } from "lucide-react";
import Link from "next/link";

const Communities = () => {
    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 w-full items-center gap-8'>
                    <HelpingHand size={48} />
                    <h1>Communities</h1>
                </div>
                <div className='flex justify-end items-center gap-2'>
                    <Button className='cursor-pointer invisible lg:visible' variant='ghost' asChild>
                        <Link href='#'>
                            Join
                        </Link>
                    </Button>
                    <Button className='cursor-pointer invisible lg:visible' variant='ghost' asChild>
                        <Link href='#'>
                            Create
                        </Link>
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default Communities;