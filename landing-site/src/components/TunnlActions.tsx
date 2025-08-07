import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import { HandHelping, Users, MonitorSmartphone, ChartSpline } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import createTunnelBindingImage from '@/assets/create-tunnel-binding.png';
import serviceShareInviteImage from '@/assets/service-share-invite.png';
import identityEnrollmentImage from '@/assets/identity-enrollment.png';
import metricsImage from '@/assets/metrics.png';


const CreatingAction = () => {
    return (
        <>
            <CardHeader>
                <CardTitle>Create a Service</CardTitle>
                <CardDescription>Create your services through a powerful UI</CardDescription>
            </CardHeader>
            <CardContent className='w-full flex flex-col justify-center gap-8'>
                <img
                    className='shadow-2xl slide3 w-full h-auto outline-4 rounded-lg'
                    src={createTunnelBindingImage.src} />
            </CardContent>
            <CardFooter className='sm:text-lg'>
                Create services that can be accessed on any domain that's not a valid TLD.
                Services can be TCP, UDP, or both. Map a port to another port, or forward the ports
                from the client to the host.
            </CardFooter>
        </>
    );
}

const SharingAction = () => {
    return (
        <>
            <CardHeader>
                <CardTitle>Share a Service</CardTitle>
                <CardDescription>Share your services by sending an invite link</CardDescription>
            </CardHeader>
            <CardContent className='w-full flex flex-col justify-center gap-8'>
                <img
                    className='shadow-2xl slide3 w-full h-auto outline-4 rounded-lg'
                    src={serviceShareInviteImage.src} />
            </CardContent>
            <CardFooter className='sm:text-lg'>
                To accept the share recipients can click the Accept button.
                Then all their enrolled identities will be granted access to the Intercept.
                Any changes to the Intercept will update their identities service list.
            </CardFooter>
        </>
    );
}

const EnrollingAction = () => {
    return (
        <>
            <CardHeader>
                <CardTitle>Enroll an Identity</CardTitle>
                <CardDescription>Add a device to your network</CardDescription>
            </CardHeader>
            <CardContent className='w-full flex flex-col justify-center gap-8'>
                <img
                    className='shadow-2xl slide3 w-full h-auto outline-4 rounded-lg'
                    src={identityEnrollmentImage.src} />
            </CardContent>
            <CardFooter className='sm:text-lg'>
                Identities are program connected to the OpenZiti fabric.
                Edge tunnelers are identities that correspond to a device,
                with access to Intercept and Host configs created in
                the Tunnl.app dashboard.
            </CardFooter>
        </>
    );
}

const MetricsAction = () => {
    return (
        <>
            <CardHeader>
                <CardTitle>View Service Metrics</CardTitle>
                <CardDescription>See who is accessing your services and how much</CardDescription>
            </CardHeader>
            <CardContent className='w-full flex flex-col justify-center gap-8'>
                <img
                    className='shadow-2xl slide3 w-full h-auto outline-4 rounded-lg'
                    src={metricsImage.src} />
            </CardContent>
            <CardFooter className='sm:text-lg'>
                Tunnl.app provides data on who is accessing your services, giving
                insights into who is doing what on the services you own.
            </CardFooter>
        </>
    );
}

const TunnlAction = ({
    action
}: {
    action: 'creating' | 'sharing' | 'enrolling' | 'metrics'
}) => {
    switch (action) {
        case 'creating': return <CreatingAction />;
        case 'sharing': return <SharingAction />;
        case 'enrolling': return <EnrollingAction />;
        case "metrics": return <MetricsAction />;
    }
}

const TunnelActions = () => {
    const [activeSection, setActiveSection] = useState<'creating' | 'sharing' | 'enrolling' | 'metrics'>('creating');
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        const preloadImage = (src: string) => {
            const img = new Image();
            img.src = src;
        };

        preloadImage(createTunnelBindingImage.src);
        preloadImage(serviceShareInviteImage.src);
        preloadImage(identityEnrollmentImage.src);
        preloadImage(metricsImage.src);

        setIsLoaded(true);
    }, []);
    const inactiveVariant = 'ghost';
    const activeVariant = 'default';
    return isLoaded ? (
        <div>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-6 sm:w-full justify-center px-10'>
                <Button
                    onClick={() => setActiveSection('creating')}
                    variant={activeSection === 'creating' ? activeVariant : inactiveVariant}>
                    Create <HandHelping /></Button>
                <Button
                    onClick={() => setActiveSection('sharing')}
                    variant={activeSection === 'sharing' ? activeVariant : inactiveVariant}>
                    Share <Users />
                </Button>
                <Button
                    onClick={() => setActiveSection('enrolling')}
                    variant={activeSection === 'enrolling' ? activeVariant : inactiveVariant}>
                    Enroll <MonitorSmartphone />
                </Button>
                <Button
                    onClick={() => setActiveSection('metrics')}
                    variant={activeSection === 'metrics' ? activeVariant : inactiveVariant}>
                    View Metrics <ChartSpline />
                </Button>
            </div>
            <div className='mt-6 px-4 sm:min-h-[620px]'>
                <Card className='w-full'>
                    <TunnlAction action={activeSection} />
                </Card>
            </div>
        </div>
    ) : <></>;
}

export default TunnelActions;
