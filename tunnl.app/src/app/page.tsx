import Content from '@/components/content';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Home = () => {
    return (
        <main>
            <div
                className='flex justify-center items-center h-8 bg-accent font-mono text-sm'>
                Alpha release coming soon! 🚀
            </div>
            <Navbar />
            <Content>
                <div className='min-h-screen'>
                    <div className=' w-full grid grid-rows-2 md:grid-cols-3 gap-x-8 flex-1 mt-24'>
                        <div className='flex h-full items-center text-5xl font-bold text-center md:text-left md:col-span-2'>
                            <p>Easily share private services with your friends.</p>
                        </div>
                        <div className='flex gap-8 flex-col justify-end items-center text-muted-foreground text-xl text-center md:text-left'>
                            <p>
                                Tunnl is the only app you need for sharing
                                private services with your friends without a
                                hassel securely over the internet.
                            </p>
                            <Button asChild>
                                <Link href='/login' className='w-full'>
                                    Start here &rarr;
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </Content>
            <div className='text-center bg-accent text-muted-foreground'>
                Leave feedback at <b>aidanhop1@gmail.com</b>  or my discord  <b>aidan12312</b>
            </div>
        </main>
    );
}

export default Home;
