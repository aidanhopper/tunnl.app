import Content from "@/components/content";
import PlatformSelector from "@/components/download/platform-selector";
import PlatformSwitch from "@/components/download/platform-switch";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLatestUpdateMessage, IGetLatestUpdateMessageResult } from "@/db/types/update_messages.queries";
import client from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

const DownloadPage = async () => {
    let message: IGetLatestUpdateMessageResult | null = null;
    const messageList = await getLatestUpdateMessage.run(undefined, client);
    if (messageList.length !== 0) message = messageList[0];
    return (
        <main className='min-h-screen flex flex-col'>
            <div className='flex justify-center items-center text-center p-1 bg-accent font-mono text-sm'>
                {message?.content ?? <>&nbsp;</>}
            </div>
            <Navbar />
            <Content className='grid gap-8'>
                <Card className='mt-12'>
                    <CardHeader>
                        <CardTitle className='lg:text-5xl text-center'>
                            Download
                        </CardTitle>
                        <CardDescription className='text-center lg:text-lg'>
                            Install the app and register an identity to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex gap-14 justify-center flex-wrap items-center'>
                        <div className='flex gap-4 justify-center flex-wrap items-center'>
                            <PlatformSelector />
                        </div>
                        <p>
                            Check out the
                            <Button className='p-0 px-1 m-0' variant='link' asChild>
                                <Link href='https://openziti.io/docs/downloads' target='_blank'>
                                    openziti.io
                                </Link>
                            </Button>
                            docs for more information on installing a Ziti Edge Tunneler on your system
                        </p>
                    </CardContent>
                </Card>
                <PlatformSwitch />
            </Content>
            <div className='flex items-end flex-1 mt-10'>
                <div className='w-full text-center bg-accent text-muted-foreground'>
                    Leave feedback at <b>aidanhop1@gmail.com</b>  or my discord  <b>aidan12312</b>
                </div>
            </div>
        </main>
    );
}

export default DownloadPage;
