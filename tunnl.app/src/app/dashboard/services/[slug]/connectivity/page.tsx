import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceBySlug } from "@/db/types/services.queries";
import client from "@/lib/db";
import { notFound } from "next/navigation";

const DashboardServiceConnectvity = async ({ params }: { params: { slug: string } }) => {
    const slug = (await params).slug;

    const serviceList = await getServiceBySlug.run(
        {
            slug: slug
        },
        client
    );
    if (serviceList.length === 0) notFound();
    const service = serviceList[0]

    return (
        <Card>
            <CardHeader>
                <CardDescription>
                    Connectitivy settings for {service.name}
                </CardDescription>
            </CardHeader>
            <CardContent className='h-96'>
                connectitivy
            </CardContent >
        </Card>
    );
}

export default DashboardServiceConnectvity;
