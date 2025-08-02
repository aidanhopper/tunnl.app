import Content from "@/components/content";
import JoinShareButton from "@/components/join-share-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { selectShareLinkBySlug } from "@/db/types/share_links.queries";
import pool from "@/lib/db";
import getHost from "@/lib/host";
import { getShareLink, ShareLink } from "@/lib/models/share-link";
import { UserManager } from "@/lib/models/user";
import { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>,
}): Promise<Metadata> => {

    const host = await getHost();

    const defaultMetadata: Metadata = {
        title: `${host} — Not Found`,
        description: `${host} makes it easy to share private services with yourself and your friends over the internet.`,
    }

    const slug = (await params).slug;

    const client = await pool.connect();
    try {
        const res = await selectShareLinkBySlug.run({ slug }, client);
        if (res.length === 0) throw new Error('Share ')
        const shareLink = new ShareLink({ pool, data: res[0] });
        const service = await shareLink.getService()
        if (!service) throw new Error('Service does not exist');
        return {
            title: `${host} — Invite to a ${service.getName()} service share`,
            description: `Click the link to join a ${service.getName()} service share from ${shareLink.getProducerEmail()}.`,
        }
    } catch {
        return defaultMetadata;
    } finally {
        client.release();
    }
}

const ShareLinkPage = async ({
    shareLink,
    autojoin = false
}: {
    shareLink: ShareLink,
    autojoin?: boolean
}) => {
    const shareLinkClientData = await shareLink.getClientData();

    const handleJoin = async () => {
        'use server'
        const user = await new UserManager(pool).auth();
        if (!user) redirect(`/login?autologin&redirect=${encodeURIComponent('/' + shareLinkClientData.slug + '?autojoin')}`);
        if (user.getEmail() === shareLinkClientData.producerEmail) redirect('/dashboard');
        await user.getShareLinkConsumerManager().consume(shareLinkClientData.slug);
        redirect('/dashboard/shares');
    }

    if (autojoin) await handleJoin();

    const service = await shareLink.getService() || notFound();

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
                            Invite from {shareLink.getProducerEmail()} to the {service.getName()} service
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

    const shareLink = await getShareLink({ slug, pool });

    if (shareLink)
        return <ShareLinkPage
            autojoin={search?.autojoin !== undefined}
            shareLink={shareLink} />

    return notFound();
}

export default DynamicPage;
