import Content from "@/components/content";
import JoinShareButton from "@/components/join-share-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getService } from "@/db/types/services.queries";
import { getShareLinkBySlug, IGetShareLinkBySlugResult, getShareLinkOwnerEmail } from "@/db/types/share_links.queries";
import { getTunnelBinding } from "@/db/types/tunnel_bindings.queries";
import createShare from "@/lib/actions/shares/create-share";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const ShareLinkPage = async ({ shareLink }: { shareLink: IGetShareLinkBySlugResult }) => {
    if (shareLink.expires < new Date()) notFound();

    const session = await getServerSession();
    const email = session?.user?.email;
    if (!email) redirect(`/login?redirect=${encodeURIComponent('/' + shareLink.slug)}`);

    const ownerEmailList = await getShareLinkOwnerEmail.run({ slug: shareLink.slug }, client);
    if (ownerEmailList.length === 0) return <></>;
    const ownerEmail = ownerEmailList[0].email;

    if (ownerEmail === email) redirect('/dashboard');

    const tunnelBindingList = await getTunnelBinding.run({ id: shareLink.tunnel_binding_id }, client);
    if (tunnelBindingList.length === 0) return <></>;
    const tunnelBinding = tunnelBindingList[0];

    const serviceList = await getService.run({ id: tunnelBinding.service_id }, client);
    if (serviceList.length === 0) return <></>;
    const service = serviceList[0];

    const handleJoin = async () => {
        'use server'
        await createShare(shareLink.slug);
        redirect('/dashboard');
    }

    return (
        <Content className='min-h-screen flex items-center justify-center py-16 px-1'>
            <div className='flex flex-col gap-8 max-w-lg mx-auto'>
                <h3 className='text-5xl font-bold'>
                    Hey there! &nbsp; &nbsp; 👋
                </h3>
                <h3 className='text-3xl font-bold'>
                    You have recieved an invite to join a service share on <Link href='/' className='font-mono'>tunnl.app</Link>
                </h3>
                <Card>
                    <CardHeader>
                        <CardTitle className='text-center'>
                            Invite from {ownerEmail} to the {service.name} service
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <JoinShareButton onClick={handleJoin} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>How to Enroll WIndows &amp; MacOS Identities</CardTitle>
                    </CardHeader>
                    <CardContent className='justify-center flex'>
                        <iframe
                            width="427"
                            height="240"
                            src="https://www.youtube.com/embed/8vt5JISH28Y"
                            title="How to Enroll WIndows &amp; MacOS Identities in Tunnl.app"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>How to Enroll Android &amp; iOS Identities</CardTitle>
                    </CardHeader>
                    <CardContent className='justify-center flex'>
                        <iframe
                            width="427"
                            height="240"
                            src="https://www.youtube.com/embed/HrnGIJx_auA"
                            title="How to Enroll Android &amp; iOS Identities in Tunnl.app"
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" />
                    </CardContent>
                </Card>
                <p className='text-center'>
                    Leave feedback at <b>aidanhop1@gmail.com</b>  or my discord  <b>aidan12312</b>
                </p>
            </div>
        </Content>
    );
}

const DynamicPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;

    if (slug.toString().length !== 12) return notFound();

    const shareLinkList = await getShareLinkBySlug.run({ slug: slug }, client);

    if (shareLinkList.length !== 0)
        return <ShareLinkPage shareLink={shareLinkList[0]} />

    return notFound();
}

export default DynamicPage;
