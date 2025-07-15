import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { HelpingHand } from "lucide-react";
import ServicesTable from "@/components/dashboard/services/service-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import CreateServiceForm from "@/components/dashboard/services/create-service-form";
import { getServicesByEmail } from "@/db/types/services.queries";
import client from '@/lib/db';
import { getServerSession } from 'next-auth';
import { unauthorized } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import userIsApproved from "@/lib/user-is-approved";
import ApprovalCard from "@/components/dashboard/approval-card";

const Services = async () => {
    const session = await getServerSession();
    const email = session?.user?.email;
    if (!email) unauthorized();

    const approved = await userIsApproved(email);

    const services = await getServicesByEmail.run({ email: email }, client);

    return (
        <DashboardLayout>
            <div className='flex gap-8 flex-col'>
                <div className='flex'>
                    <div className='flex flex-1 items-center gap-8'>
                        <HelpingHand size={48} />
                        <h1>Services</h1>
                    </div>
                    <div className='flex justify-end items-center'>
                        <Dialog>
                            <Button
                                className='cursor-pointer'
                                variant='secondary'
                                disabled={!approved}
                                asChild>
                                <DialogTrigger>
                                    Create
                                </DialogTrigger>
                            </Button>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Create a service
                                    </DialogTitle>
                                    <DialogDescription>
                                        Create a service that can be securely shared across users, identities, and the internet.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateServiceForm />
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                {!approved &&
                    <ApprovalCard
                        email={email} />}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Services List
                        </CardTitle>
                        <CardDescription>
                            This is where your services will be when you create them
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ServicesTable services={services} />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

export default Services;
