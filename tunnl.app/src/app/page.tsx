import Content from '@/components/content';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { getLatestUpdateMessage, IGetLatestUpdateMessageResult } from '@/db/types/update_messages.queries';
import client from '@/lib/db';
import Link from 'next/link';

const Home = async () => {
    let message: IGetLatestUpdateMessageResult | null = null;
    const messageList = await getLatestUpdateMessage.run(undefined, client);
    if (messageList.length !== 0) message = messageList[0];
    return (
        <main className='min-h-screen flex flex-col'>
            <div className='flex justify-center items-center text-center p-1 bg-accent font-mono text-sm'>
                {message?.content ?? <>&nbsp;</>}
            </div>
            <Navbar />
            <Content className='flex flex-col gap-8'>
                <div className=' w-full grid grid-rows-2 md:grid-cols-3 gap-x-8 flex-1 mt-24'>
                    <div className='flex h-full items-center font-bold text-center md:text-left md:col-span-2'>
                        <span className='text-6xl'>Easily share private services across networks.</span>
                    </div>
                    <div className='flex gap-8 flex-col justify-end items-center text-muted-foreground text-xl text-center md:text-left'>
                        <p>
                            Tunnl is the only software you need for sharing
                            private services with yourself and friends over
                            the internet.
                        </p>
                        <Button asChild>
                            <Link href={`/login?redirect=${encodeURIComponent('/dashboard')}&autologin`} className='w-full'>
                                Start here &rarr;
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className='grid grid-cols-3 gap-8'>
                </div>
            </Content>
            <div className='flex items-end flex-1 mt-10'>
                <div className='w-full text-center bg-accent text-muted-foreground'>
                    Leave feedback at <b>aidanhop1@gmail.com</b>  or my discord  <b>aidan12312</b>
                </div>
            </div>
        </main>
    );
}

export default Home;
