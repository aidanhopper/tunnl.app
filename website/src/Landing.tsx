import { useUser } from './user';
import { useState, useEffect, useRef } from 'react';
import { Navbar, NavbarSection } from './components/Navbar';
import Container from './components/Container';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownLink, DropdownButton
} from './components/Dropdown';
import { Link } from 'react-router-dom';
import { postLogout } from './API';
import { motion, AnimatePresence } from 'framer-motion';

const Tagline = ({ highlightedClassName = '', sentenceClassName = '' }:
    { highlightedClassName?: string, sentenceClassName?: string }) => {
    const textRef = useRef<HTMLSpanElement>(null)
    const [width, setWidth] = useState(50);

    const headerCycle = [
        {
            content: 'Teamspeak',
            color: 'bg-pink-900'
        },
        {
            content: 'Plex',
            color: 'bg-amber-900'
        },
        {
            content: 'Mumble',
            color: 'bg-green-900'
        },
        {
            content: 'Website',
            color: 'bg-black'
        },
        {
            content: 'Sunshine',
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

    const [index, setIndex] = useState(Math.floor(Math.random() * 1000) % headerCycle.length);

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
        <div className={`flex-1 flex flex-col justify-center ${sentenceClassName}
                items-center xl:items-start text-neutral-700`}>
            <div className='flex flex-col xl:flex-row mb-4 items-center'>
                <h1 className='font-bold mb-4 xl:mb-0'>Easily share &nbsp;</h1>
                <motion.div
                    style={{
                        width: textRef.current?.offsetWidth,
                        height: textRef.current ? textRef.current.offsetHeight + 30 : 0
                    }}
                    animate={{ width: width + 35 }}
                    transition={{ duration: 0.7, type: 'spring' }}
                    className={`${headerCycle[index].color} rounded-xl p-4
                        text-neutral-100 font-bold ${highlightedClassName}`}>
                    <AnimatePresence initial={false}>
                        <motion.div className='whitespace-nowrap absolute z-0'
                            key={`${index}`}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.2, delay: 0.1 }}>
                            {headerCycle[index].content}
                        </motion.div>
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
        <div className={`min-h-screen flex flex-col duration-200 w-screen ${isStuck ? 'bg-neutral-300' : 'bg-neutral-200'}`}>
            <div className='bg-neutral-600 w-full h-8 flex justify-center items-center text-white'>
                <code>Alpha release coming soon!</code>
            </div>
            <Navbar onStick={() => setIsStuck(true)} onUnstick={() => setIsStuck(false)} className='flex bg-neutral-200'>
                <NavbarSection className='font-bold text-2xl text-neutral-600'>
                    <Link to='/'><code>tunnl.app</code></Link>
                </NavbarSection>
                <NavbarSection className='flex justify-end'>
                    <div className='flex items-center'>
                        <button
                            className='text mr-4 xl:mr-12 hover:bg-neutral-500 px-3 py-1 font-bold
                                rounded text-neutral-200 bg-neutral-600 duration-150 cursor-pointer'>
                            Download
                        </button>
                        {
                            user ?
                                <>
                                    <h1 className='mr-4 xl:mr-12 font-bold text-neutral-600'>{user.email}</h1>
                                    <DropdownProvider>
                                        <DropdownToggle>
                                            <img className='cursor-pointer bg-neutral-800 min-w-12 hover:border-neutral-400
                                                min-h-12 w-12 h-12 border-neutral-600 border-2 rounded-full duration-150'
                                                src={user.picture} />
                                        </DropdownToggle>
                                        <Dropdown offsetX={-70} offsetY={55} className='w-[120px]'>
                                            <DropdownGroup>
                                                <DropdownLink to='/dashboard'>
                                                    Dashboard
                                                </DropdownLink>
                                                <DropdownButton onClick={async () => {
                                                    await postLogout();
                                                    setUser(null);
                                                }}>
                                                    Logout
                                                </DropdownButton>
                                            </DropdownGroup>
                                        </Dropdown>
                                    </DropdownProvider>
                                </>
                                :
                                <Link to='/login' className='hover:bg-neutral-600 hover:text-neutral-100
                                duration-150 py-1 px-2 rounded'>
                                    Login
                                </Link>
                        }
                    </div>
                </NavbarSection>
            </Navbar>
            <div className='h-[400px]'>
                <Container>
                    <div className='w-full h-full flex flex-col xl:flex-row items-center
                        xl:px-20 xl:justify-center xl:items-left'>
                        <Tagline
                            highlightedClassName='text-4xl xl:text-5xl'
                            sentenceClassName='text-4xl xl:text-6xl' />
                        <div className='w-[400px] flex flex-col justify-center items-left text-neutral-700 text-lg'>
                            <p>
                                tunnl.app makes it easy to securely share and join any private service
                                with your communitiies over any domain you choose.
                            </p>
                            <div className='mt-7'>
                                <Link to={user ? '/dashboard' : '/login'}
                                    className='rounded-md bg-neutral-600 text-neutral-100
                                    py-2 px-3 font-semibold hover:bg-neutral-500 duration-150 cursor-pointer'>
                                    Start here &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
            <div className='flex w-full h-screen items-end text-neutral-100'>
                <div className='flex bg-neutral-600 py-3 items-center w-full justify-center'>
                    <div className=''>
                        Leave feedback at &nbsp;
                        <code className='p-1 bg-neutral-700 rounded'>
                            <a href='mailto:aidanhop1@gmail.com'>aidanhop1@gmail.com</a>
                        </code>
                        &nbsp;
                        or my discord &nbsp;
                        <code className='p-1 bg-neutral-700 rounded'>
                            aidan12312
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Landing;
