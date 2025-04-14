import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { HelpingHand } from "lucide-react";
import ServicesTable from "@/components/dashboard/services/service-table";
import { Service } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import CreateServiceForm from "@/components/dashboard/services/create-service-form";
const services: Service[] = [
    {
        service: 'Portfolio',
        device: 'VPS-1',
        domain: 'my.portfolio',
        host: '127.0.0.1',
        ports: {
            forwardPorts: false,
            sourcePort: '3000',
            accessPort: '80'
        },
        publicShare: 'https://my-portfolio.srv.tunnl.app',
        created: '10/23/2025',
    },
]

const Services = () => {
    return (
        <DashboardLayout>
            <div className='flex'>
                <div className='flex flex-1 items-center gap-8'>
                    <HelpingHand size={48} />
                    <h1>Services</h1>
                </div>
                <div className='flex justify-end items-center'>
                    <Dialog>
                        <Button className='cursor-pointer' variant='ghost' asChild>
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
            <ServicesTable services={services} />
        </DashboardLayout >
    );
}

export default Services;
