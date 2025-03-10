import { useUser } from './user';
import { useState, useEffect, useRef } from 'react';
import { Navbar, NavbarSection } from './components/Navbar';
import Container from './components/Container';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownLink, DropdownButton
} from './components/Dropdown';
import { Link } from 'react-router-dom';
import { postLogout, startTunneler, stopTunneler } from './API';
import { motion, AnimatePresence } from 'framer-motion';

const Tagline = () => {
    const [index, setIndex] = useState(1);
    const textRef = useRef<HTMLSpanElement>(null)
    const [width, setWidth] = useState(0);

    const headerCycle = [
        {
            content: 'Plex',
            color: 'bg-amber-900'
        },
        {
            content: 'Mumble',
            color: 'bg-green-900'
        },
        {
            content: 'Minecraft Server',
            color: 'bg-red-900'
        },
        {
            content: 'Website',
            color: 'bg-black'
        },
        {
            content: 'Desktop Service',
            color: 'bg-blue-900'
        },
        {
            content: 'Jellyfin',
            color: 'bg-purple-900'
        },
        {
            content: 'Bittorrent',
            color: 'bg-sky-900'
        },
        {
            content: 'Immich',
            color: 'bg-lime-900'
        },
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % headerCycle.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [headerCycle.length]);

    useEffect(() => {
        if (!textRef.current) return;
        const box = textRef.current.getBoundingClientRect();
        setWidth(box.width);
    }, [index]);

    return (
        <div className='flex-1 flex flex-col justify-center text-6xl text-neutral-700'>
            <div className='flex mb-4 items-center'>
                <h1 className='font-bold'>Share private &nbsp;</h1>
                <motion.div
                    animate={{ width: width + 35 }}
                    transition={{ duration: 1, type: 'spring' }}
                    className={`${headerCycle[index].color} rounded-xl p-4
                        text-neutral-100 font-bold text-5xl h-20 w-48`}>
                    <AnimatePresence>
                        <motion.span className='whitespace-nowrap overflow-hidden absolute z-0'
                            key={`${index}`}
                            initial={{ opacity: 0, y: 60 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -60 }}
                            transition={{ duration: 0.2, delay: 0.1 }}>
                            {headerCycle[index].content}
                        </motion.span>
                    </AnimatePresence>
                    <span ref={textRef} className='absolute bg-black whitespace-nowrap invisible'>
                        {headerCycle[index].content}
                    </span>
                </motion.div>
            </div>
            <h1 className='font-bold'>instances with your friends.</h1>
        </div>
    );
}

const Landing = () => {
    const { user, setUser } = useUser();
    const [isStuck, setIsStuck] = useState(false);
    const [firstWindowHeight, setFirstWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setFirstWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize) }
    }, []);


    return (
        <div className={`h-screen duration-200 w-screen ${isStuck ? 'bg-neutral-300' : 'bg-neutral-200'}`}>
            <div className='bg-neutral-600 w-full h-8 flex justify-center items-center text-white'>
                <code>Alpha release coming soon!</code>
            </div>
            <Navbar onStick={() => setIsStuck(true)} onUnstick={() => setIsStuck(false)} className='bg-neutral-200'>
                <NavbarSection className='font-bold text-2xl text-neutral-600'>
                    <Link to='/'><code>tunnl.app</code></Link>
                </NavbarSection>
                <NavbarSection className='justify-end'>
                    <button
                        className='text mr-12 hover:bg-neutral-500 px-3 py-1 font-bold
                                rounded text-neutral-200 bg-neutral-600 duration-150 cursor-pointer'>
                        Download
                    </button>
                    {
                        user ?
                            <>
                                <h1 className='mr-12 font-bold text-neutral-600'>{user.email}</h1>
                                <DropdownProvider>
                                    <DropdownToggle>
                                        <img className='cursor-pointer bg-neutral-800 min-w-12 hover:border-neutral-400
                                                min-h-12 w-12 h-12 border-neutral-600 border-2 rounded-full duration-150'
                                            src={user.picture} />
                                    </DropdownToggle>
                                    <Dropdown offsetX={-120} offsetY={10} className='w-[120px]'>
                                        <DropdownGroup>
                                            <DropdownLink to='/dashboard'>
                                                Dashboard
                                            </DropdownLink>
                                            <DropdownButton onClick={async () => {
                                                await postLogout();
                                                setUser(null);
                                            }}>
                                                Log Out
                                            </DropdownButton>
                                        </DropdownGroup>
                                    </Dropdown>
                                </DropdownProvider>
                            </>
                            :
                            <Link to='/login' className='hover:bg-neutral-600 hover:text-neutral-100
                                duration-150 py-1 px-2 rounded'>
                                Sign In
                            </Link>
                    }
                </NavbarSection>
            </Navbar>
            <div className='h-[500px]'>
                <Container>
                    <div className='w-full h-full flex px-20'>
                        <Tagline />
                        <div className='w-[400px] flex flex-col justify-center items-left text-neutral-700 text-lg'>
                            <p>
                                tunnl.app makes it easy to share any private service
                                with your friends and securely with custom DNS.
                            </p>
                            <div className='mt-7'>
                                <Link to='/login'
                                    className='rounded-md bg-neutral-600 text-neutral-100
                                    py-2 px-3 font-semibold hover:bg-neutral-500 duration-150 cursor-pointer'>
                                    Start sharing services &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    );
}

export default Landing;
