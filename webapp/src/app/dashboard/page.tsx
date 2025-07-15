import ApprovalCard from "@/components/dashboard/approval-card";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import HomeSkeleton from "@/components/dashboard/home/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIdentitiesByEmail } from "@/db/types/identities.queries";
import { getServicesByEmail } from "@/db/types/services.queries";
import { getSharesByEmail } from "@/db/types/shares.queries";
import client from "@/lib/db";
import userIsApproved from "@/lib/user-is-approved";
import { Home } from "lucide-react";
import { getServerSession } from "next-auth";

const Dashboard = async () => {
    const session = await getServerSession();
    const email = session?.user?.email;
    const approved = await userIsApproved(email);

    const services = await getServicesByEmail.run({ email: email }, client);
    const identites = await getIdentitiesByEmail.run({ email: email }, client);
    const shares = await getSharesByEmail.run({ email: email }, client);

    return (
        <DashboardLayout>
            <div className='flex flex-col gap-8'>
                <div className='flex flex-1 items-center gap-8'>
                    <Home size={48} />
                    <h1>Home</h1>
                </div>
                {!approved ? <ApprovalCard email={email} /> :
                    <div className='grid gap-8 mx-auto w-fit'>
                        <div className='w-72'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Tutorials you might find useful
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </div>
                        <div className='flex gap-8 flex-col'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        What To Do When You&#39;ve An Invite
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <iframe
                                        width="427"
                                        height="240"
                                        src="https://www.youtube.com/embed/erYEcA-F5zQ"
                                        title="What To Do When You&#39;ve An Invite on Tunnl.app"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen></iframe>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        How to Enroll Android &amp; iOS Identities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <iframe
                                        width="427"
                                        height="240"
                                        src="https://www.youtube.com/embed/HrnGIJx_auA"
                                        title="How to Enroll Android &amp; iOS Identities in Tunnl.app"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen></iframe>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        How to Enroll WIndows &amp; MacOS Identities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <iframe
                                        width="427"
                                        height="240"
                                        src="https://www.youtube.com/embed/8vt5JISH28Y"
                                        title="How to Enroll WIndows &amp; MacOS Identities in Tunnl.app"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen></iframe>
                                </CardContent>
                            </Card>
                        </div>
                    </div>}
            </div>
        </DashboardLayout >
    );
}

export default Dashboard;
