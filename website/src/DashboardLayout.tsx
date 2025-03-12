import { useNavigate } from 'react-router-dom';
import { useUser } from './user';
import {
    Sidebar, SidebarBody, SidebarProvider, SidebarButton,
    SidebarFooter, SidebarLink, SidebarHeader
} from './components/Sidebar';
import { useEffect, useState } from 'react';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownLink, DropdownButton,
} from './components/Dropdown';
import { postLogout } from './API';
import { useNavPath } from './hooks';
import { Link } from 'react-router-dom';

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const navPath = useNavPath().filter(s => s !== 'dashboard');
    const page = navPath.length >= 1 ? navPath[0] : null;
    const [width, setWidth] = useState(300);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 900) setWidth(300);
            else setWidth(window.innerWidth);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize) }
    }, [])


    return user !== null ? (
        <div className='flex w-screen h-screen'>
            <SidebarProvider>
                <Sidebar expandedWidth={width} contractedWidth={0}
                    className='bg-neutral-600 w-full text-neutral-100 overflow-x-hidden'
                    onExpand={() => setIsSidebarExpanded(true)} onContract={() => setIsSidebarExpanded(false)}>
                    <SidebarHeader>
                        <div className='h-14 flex items-center px-16 justify-left'>
                            <h1 className='font-bold'>
                                <Link to='/'>
                                    <code className='rounded-md p-1 hover:bg-neutral-500 duration-150'>
                                        tunnl.app
                                    </code>
                                </Link>
                            </h1>
                        </div>
                    </SidebarHeader>
                    <SidebarBody className='p-5'>
                        <SidebarLink
                            to={page === 'communities' ? '/dashboard' : '/dashboard/communities'}
                            imgPath='/communities.svg'
                            active={page === 'communities'}>
                            Communities
                        </SidebarLink>
                        <SidebarLink
                            to={page === 'services' ? '/dashboard' : '/dashboard/services'}
                            imgPath='/services.svg'
                            active={page === 'services'}>
                            Services
                        </SidebarLink>
                        <SidebarLink
                            to={page === 'devices' ? '/dashboard' : '/dashboard/devices'}
                            imgPath='/devices.svg'
                            active={page === 'devices'}>
                            Devices
                        </SidebarLink>
                    </SidebarBody>
                    <SidebarFooter>
                        <div className='w-full h-full text-neutral-200 shrink-0'>
                            <DropdownProvider>
                                <Dropdown offsetX={-70} offsetY={-150}>
                                    <DropdownGroup>
                                        <DropdownButton>
                                            Change name
                                        </DropdownButton>
                                        <DropdownButton onClick={async () => {
                                            await postLogout();
                                            setUser(null);
                                            navigate('/');
                                        }}>
                                            Logout
                                        </DropdownButton>
                                    </DropdownGroup>
                                </Dropdown>
                                <div className='w-full h-full flex items-center p-4'>
                                    <div className='flex items-center w-full'>
                                        <div className='flex'>
                                            <DropdownToggle>
                                                <img className='cursor-pointer bg-neutral-800
                                                    hover:border-neutral-100 select-none  min-w-16
                                                    min-h-16 w-16 h-16 border-neutral-400 z-0
                                                    border-2 rounded-full duration-150'
                                                    src={`${user.picture}`} />
                                            </DropdownToggle>
                                        </div>
                                        <div className='flex flex-1 font-bold justify-left
                                            whitespace-nowrap px-4'>
                                            {user.displayName}
                                        </div>
                                    </div>
                                </div>
                            </DropdownProvider>
                        </div>
                    </SidebarFooter>
                </Sidebar>
                <div className='w-full h-full bg-neutral-200 text-neutral-600 overflow-x-hidden'>
                    {children}
                </div>
            </SidebarProvider>
        </div>
    ) : <></>;
}

export default DashboardLayout;
