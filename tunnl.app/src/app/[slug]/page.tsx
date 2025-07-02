import { getShareLinkBySlug, IGetShareLinkBySlugResult } from "@/db/types/share_links.queries";
import client from "@/lib/db";
import { notFound } from "next/navigation";

const ShareLinkPage = ({ shareLink }: { shareLink: IGetShareLinkBySlugResult }) => {
    return (
        <>
            {shareLink.tunnel_binding_id}
        </>
    );
}

const DynamicPage = async ({ params }: { params: { slug: string } }) => {
    const slug = (await params).slug;

    const shareLinkList = await getShareLinkBySlug.run({ slug: slug }, client);

    if (shareLinkList.length !== 0)
        return <ShareLinkPage shareLink={shareLinkList[0]} />

    return notFound();
}

export default DynamicPage;
