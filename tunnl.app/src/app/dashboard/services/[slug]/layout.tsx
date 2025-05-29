import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ServiceNavButton from "@/components/dashboard/services/service-nav-button";
import { Card, CardContent } from "@/components/ui/card";
import { getServiceBySlug } from "@/db/types/services.queries";
import { getUserByEmail } from "@/db/types/users.queries";
import client from "@/lib/db";
import { HelpingHand } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { forbidden, notFound, unauthorized } from "next/navigation";
import { ReactNode } from "react";

const DashboardServiceLayout = async ({ children, params }: { children: ReactNode, params: { slug: string } }) => {
    const slug = (await params).slug;

    const session = await getServerSession();
    if (!session?.user?.email) unauthorized();
    const email = session.user.email;

    const serviceList = await getServiceBySlug.run(
        {
            slug: slug
        },
        client
    );
    if (serviceList.length === 0) notFound();
    const service = serviceList[0]

    const userList = await getUserByEmail.run(
        {
            email: email,
        },
        client
    );
    if (userList.length === 0) unauthorized();
    const user = userList[0];
    if (user.id !== service.user_id) forbidden();

    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-8'>
                    <HelpingHand size={48} />
                    <h1>{service.name}</h1>
                </div>
            </div>
            <div className='mt-10 flex gap-10'>
                <div>
                    <div className='grid gap-2'>
                        <Link href={`/dashboard/services/${slug}`}>
                            <ServiceNavButton
                                activePath={`/dashboard/services/${slug}`}>
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
