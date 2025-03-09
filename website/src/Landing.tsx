import { useUser } from './user';
import { useEffect, useRef, useState } from 'react';
import { Navbar, NavbarSection } from './components/Navbar';
import Container from './components/Container';
import { DropdownToggle, DropdownProvider, Dropdown } from './components/Dropdown';
import { Link } from 'react-router-dom';

const Landing = () => {
    const { user, setUser } = useUser();
    const [isStuck, setIsStuck] = useState(false);
    const navRef = useRef<HTMLDivElement>(null)
    const [navBottom, setNavBottom] = useState(0);

    useEffect(() => {
        if (!navRef.current) return;
        const box = navRef.current.getBoundingClientRect();
        setNavBottom(box.y);
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setIsStuck(window.scrollY > navBottom); // Adjust the threshold as needed
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navBottom]);

    return (
        <div className={`min-h-screen duration-200 w-screen ${isStuck ? 'bg-neutral-300' : 'bg-neutral-200'}`}>
            <div className='bg-neutral-600 w-full h-8 flex justify-center items-center text-white'>
                <code>Alpha release coming soon!</code>
            </div>
            <div className='bg-neutral-200 sticky top-0' ref={navRef}>
                <Container>
                    <Navbar className='h-16'>
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
                                                <img className='cursor-pointer bg-neutral-800 min-w-12 hover:opacity-60
                                                min-h-12 w-12 h-12 border-neutral-600 border-2 rounded-full duration-150'
                                                    src={user.picture} />
                                            </DropdownToggle>
                                            <Dropdown offsetX={-32} offsetY={70}>
                                                <div className='flex items-center text-neutral-600 flex-col
                                                bg-neutral-100 border-neutral-600 border-2 rounded'>
                                                    <Link className='w-full px-4 py-1 hover:bg-neutral-200
                                                    rounded duration-150 cursor-pointer'
                                                        to='/dashboard'>
                                                        Dashboard
                                                    </Link>
                                                    <button className='w-full px-4 py-1 hover:bg-neutral-200
                                                    rounded duration-150 cursor-pointer'>
                                                        Log out
                                                    </button>
                                                </div>
                                            </Dropdown>
                                        </DropdownProvider>
                                    </>
                                    :
                                    <button>
                                        Sign In
                                    </button>
                            }
                        </NavbarSection>
                    </Navbar>
                </Container>
            </div>
            <div className='h-screen w-screen'>
                <Container>
                </Container>
            </div>
            <div className='h-screen w-screen'>
                <Container>
                </Container>
            </div>
        </div>
    );
}

export default Landing;
