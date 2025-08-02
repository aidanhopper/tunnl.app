import ApprovalCard from "@/components/dashboard/approval-card";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import pool from "@/lib/db";
import { UserManager } from "@/lib/models/user";
import { Home } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const Dashboard = async () => {
    const user = await new UserManager(pool).auth() || redirect(`/login?redirect=${encodeURIComponent('/dashboard')}`);
    return (
        <DashboardLayout>
            <div className='flex flex-col gap-8'>
                <div className='flex flex-1 items-center gap-8'>
                    <Home size={48} />
                    <h1>Home</h1>
                </div>
                {!user?.isApproved() && <ApprovalCard email={user.getEmail()} />}
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl font-bold mb-6 flex items-center gap-2">
                        <span className='mr-5'>🚂</span> <span>Welcome to Tunnl.app</span>
                    </h1>
                    <p className="text-lg mb-6">
                        <strong>Tunnl</strong> is a self-hostable, programmable, secure overlay network built on <Link href='https://openziti.io' target='_blank'><code className="px-1 rounded">OpenZiti</code></Link>.
                        It lets you expose private services to others through authenticated, encrypted tunnels. No public IPs, port forwarding, or traditional VPNs required.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">What can it do?</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Create private tunnels for your services</li>
                            <li>Share services with other users</li>
                            <li>Use custom domains</li>
                            <li>Fine-grained service-level access control</li>
                            <li>Works cross-platform via OpenZiti edge clients</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Quick Start</h2>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Create and enroll an identity in the <strong>Identities</strong> tab to host and access your service</li>
                            <li>Create a service in the <strong>Services</strong> tab (e.g. local web server or SSH)</li>
                            <li>Create a tunnel binding</li>
                            <li>Connect to the network using a Ziti Edge Tunnel or another Ziti network enabled application</li>
                            <li>Access your service from the intercept address</li>
                        </ol>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">How Sharing Works</h2>
                        <p>
                            Each service you create can be shared with other users using a share link. For someone to consume a share link they must have an account with your OIDC provider. To access the service the user will need to create and enroll an identity, so make sure they&apos;re approved to do so. You control who gets access to what, service by service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Notes</h2>
                        <ul className="list-disc list-inside space-y-1">
                            <li>This is a <strong>self-hostable</strong> instance, deployment features may vary</li>
                            <li>Full documentation is in progress, check GitHub for updates</li>
                        </ul>
                    </section>

                    <p className="mt-6">
                        Want to contribute or report issues?&nbsp;
                        <Button variant='link' size='sm'><Link href="https://github.com/aidanhopper/tunnl.app" target='_blank'>Visit the GitHub repo</Link></Button>
                    </p>
                </div>
            </div>
        </DashboardLayout >
    );
}

export default Dashboard;
