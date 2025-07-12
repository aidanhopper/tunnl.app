import Content from '@/components/content';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
                            <Link href={`/login?redirect=${encodeURIComponent('/dashboard')}`} className='w-full'>
                                Start here &rarr;
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className='grid grid-cols-3 gap-8'>
                   <Card></Card> 
                   <Card></Card> 
                   <Card></Card> 
                </div>
            </Content>
            <div className='flex items-end min-h-screen'>
                <div className='w-full text-center bg-accent text-muted-foreground'>
                    Leave feedback at <b>aidanhop1@gmail.com</b>  or my discord  <b>aidan12312</b>
                </div>
            </div>
        </main>
    );
}

export default Home;
