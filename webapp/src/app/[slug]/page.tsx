import Content from "@/components/content";
import JoinShareButton from "@/components/join-share-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getService } from "@/db/types/services.queries";
import { getShareLinkBySlug, IGetShareLinkBySlugResult, getShareLinkOwnerEmail } from "@/db/types/share_links.queries";
import { getTunnelBinding } from "@/db/types/tunnel_bindings.queries";
import createShare from "@/lib/actions/shares/create-share";
import client from "@/lib/db";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>,
}): Promise<Metadata> => {

    const defaultMetadata: Metadata = {
        title: "Tunnl.app — Not Found",
        description: "Tunnl.app makes it easy to share private services with yourself and your friends over the internet.",
    }

    const slug = (await params).slug;

    const shareLinkList = await getShareLinkBySlug.run({ slug: slug }, client);
    if (shareLinkList.length === 0) return defaultMetadata;
    const shareLink = shareLinkList[0];

    const ownerEmailList = await getShareLinkOwnerEmail.run({ slug: shareLink.slug }, client);
    if (ownerEmailList.length === 0) return defaultMetadata;
    const ownerEmail = ownerEmailList[0].email;

    if (shareLinkList.length !== 0) {
        const tunnelBindingList = await getTunnelBinding.run({ id: shareLink.tunnel_binding_id }, client);
        if (tunnelBindingList.length === 0) return defaultMetadata;
        const tunnelBinding = tunnelBindingList[0];

        const serviceList = await getService.run({ id: tunnelBinding.service_id }, client);
        if (serviceList.length === 0) return defaultMetadata;
        const service = serviceList[0];

        return {
            title: `Tunnl.app — Invite to ${service.name} service share`,
            description: `Click the link to join the ${service.name} from ${ownerEmail}`,
        }
    }

    return defaultMetadata;
}

const ShareLinkPage = async ({ shareLink, autojoin = false }: { shareLink: IGetShareLinkBySlugResult, autojoin?: boolean }) => {
    if (shareLink.expires < new Date()) notFound();

    const session = await getServerSession();
    const email = session?.user?.email;

    const ownerEmailList = await getShareLinkOwnerEmail.run({ slug: shareLink.slug }, client);
    if (ownerEmailList.length === 0) return <></>;
    const ownerEmail = ownerEmailList[0].email;

    const tunnelBindingList = await getTunnelBinding.run({ id: shareLink.tunnel_binding_id }, client);
    if (tunnelBindingList.length === 0) return <></>;
    const tunnelBinding = tunnelBindingList[0];

    const serviceList = await getService.run({ id: tunnelBinding.service_id }, client);
    if (serviceList.length === 0) return <></>;
    const service = serviceList[0];

    const handleJoin = async () => {
        'use server'
        if (ownerEmail === email) redirect('/dashboard');
        if (!email) redirect(`/login?autologin&redirect=${encodeURIComponent('/' + shareLink.slug + '?autojoin')}`)
        await createShare(shareLink.slug);
        redirect('/dashboard/shares');
    }

    if (autojoin) await handleJoin();

    return (
        <Content className='min-h-screen flex items-center justify-center py-8 px-1'>
            <div className='flex flex-col gap-8 max-w-lg mx-auto'>
                <h3 className='text-5xl sm:text-6xl font-bold'>
                    Hey there! &nbsp; 👋
                </h3>
                <h3 className='text-2xl sm:text-3xl font-bold'>
                    You have recieved an invite to join a service share on <Link href='/' target='_blank' className='font-mono'>tunnl.app</Link>
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
                        <CardTitle className='text-center'>What to do When You&apos;ve Received an Invite</CardTitle>
                        <CardDescription className='text-center'>Watch this tutorial if this is your first time here</CardDescription>
                    </CardHeader>
                    <CardContent className='justify-center flex '>
                        <iframe
                            className='h-full w-full aspect-video'
                            src="https://www.youtube.com/embed/erYEcA-F5zQ"
                            title="What To Do When You&#39;ve Received An Invite on Tunnl.app"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen></iframe>
                    </CardContent>
                </Card>
                <p className='text-center'>
                    Leave feedback at <b>aidanhop1@gmail.com</b>  or my discord  <b>aidan12312</b>
                </p>
            </div>
        </Content>
    );
}

const DynamicPage = async ({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const slug = (await params).slug;
    const search = await searchParams;

    if (slug.toString().length !== 12) return notFound();

    const shareLinkList = await getShareLinkBySlug.run({ slug: slug }, client);

    if (shareLinkList.length !== 0)
        return <ShareLinkPage
            autojoin={search?.autojoin !== undefined}
            shareLink={shareLinkList[0]} />

    return notFound();
}

export default DynamicPage;
