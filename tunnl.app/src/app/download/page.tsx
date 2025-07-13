import Content from "@/components/content";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLatestUpdateMessage, IGetLatestUpdateMessageResult } from "@/db/types/update_messages.queries";
import client from "@/lib/db";

const platformList = [
    'iOS',
    'macOS',
    'Windows',
    'Android',
    'Linux',
    'Docker',
];

const DownloadPage = async () => {
    let message: IGetLatestUpdateMessageResult | null = null;
    const messageList = await getLatestUpdateMessage.run(undefined, client);
    if (messageList.length !== 0) message = messageList[0];
    const active = 'iOS';
    return (
        <main>
            <div className='flex justify-center items-center text-center p-1 bg-accent font-mono text-sm'>
                {message?.content}
            </div>
            <Navbar />
            <Content className='grid gap-8'>
                <Card className='p-12 mt-12'>
                    <CardHeader>
                        <CardTitle className='text-5xl text-center'>
                            Download
                        </CardTitle>
                        <CardDescription className='text-center text-lg'>
                            Install the app and register an identity to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='flex gap-4 justify-center flex-wrap items-center'>
                        {platformList.map(e => {
                            return (
                                <Button
                                    key={e}
                                    variant={active === e ? 'default' : 'secondary'}
                                    className='cursor-pointer p-0 m-0 h-36 w-36 flex 
                                    items-center justify-center text-2xl font-bold'>
                                    {e}
                                </Button>
                            )
                        })}
                    </CardContent>
                </Card>
                <Card>
                    asdf
                </Card>
            </Content>
        </main>
    );
}

export default DownloadPage;
