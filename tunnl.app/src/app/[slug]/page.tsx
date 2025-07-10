import JoinShareButton from "@/components/join-share-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getService } from "@/db/types/services.queries";
import { getShareLinkBySlug, IGetShareLinkBySlugResult, getShareLinkOwnerEmail } from "@/db/types/share_links.queries";
import { getTunnelBinding } from "@/db/types/tunnel_bindings.queries";
import createShare from "@/lib/actions/shares/create-share";
import client from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

const ShareLinkPage = async ({ shareLink }: { shareLink: IGetShareLinkBySlugResult }) => {
    if (shareLink.expires < new Date()) notFound();

    const session = await getServerSession();
    const email = session?.user?.email;
    if (!email) redirect('/login');

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
        console.log(shareLink.slug)
        await createShare(shareLink.slug);
        redirect('/dashboard');
    }

    return (
        <div className='flex items-center justify-center h-screen'>
            <Card className='w-96'>
                <CardHeader>
                    <CardTitle className='leading-5 text-lg '>
                        Invite from {ownerEmail} to {service.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <JoinShareButton onClick={handleJoin} />
                </CardContent>
            </Card>
        </div>
    );
}

const DynamicPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const slug = (await params).slug;

    if (slug.toString().length !== 6) return notFound();

    const shareLinkList = await getShareLinkBySlug.run({ slug: slug }, client);

    if (shareLinkList.length !== 0)
        return <ShareLinkPage shareLink={shareLinkList[0]} />

    return notFound();
}

export default DynamicPage;
