import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ServiceNavButton from "@/components/dashboard/services/service-nav-button";
import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";
import { HelpingHand } from "lucide-react";
import Link from "next/link";
import { notFound, unauthorized } from "next/navigation";
import { ReactNode } from "react";

const DashboardServiceLayout = async ({ children, params }: { children: ReactNode, params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;
    const user = await new UserManager(pool).auth() || unauthorized();
    const service = await user.getServiceManager().getServiceBySlug(slug) || notFound();
    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-8'>
                    <HelpingHand size={48} />
                    <h1>{service.getName()}</h1>
                </div>
            </div>
            <div className='mt-10 flex flex-col lg:flex-row gap-10'>
                <div>
                    <div className='flex lg:grid gap-2 grid-cols-2 lg:grid-cols-none'>
                        <Link href={`/dashboard/services/${slug}`}>
                            <ServiceNavButton
                                activePath={`/dashboard/services/${slug}$`}>
                                General
                            </ServiceNavButton>
                        </Link>
                        <Link href={`/dashboard/services/${slug}/connectivity`}>
                            <ServiceNavButton
                                activePath={`/dashboard/services/${slug}/connectivity`}>
                                Connectivity
                            </ServiceNavButton>
                        </Link>
                    </div>
                </div>
                <div className='w-full'>
                    {children}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default DashboardServiceLayout;
