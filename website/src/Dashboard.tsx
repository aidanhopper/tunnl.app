import { useNavigate } from 'react-router-dom';
import { useUser } from './user';
import { SidebarToggle } from './components/Sidebar';
import { useEffect, useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { useNavPath } from './hooks';
import { DashboardPage, DashboardPageHeader } from './DashboardPage';
import { Table, TableHead, TableRow, TableBody, TableHeader, TableData } from './components/Table';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownButton, DropdownAnchor
} from './components/Dropdown';
import { authenticateDaemon, getHostname } from './API';
import { PopupWindowProvider, PopupWindowToggle, PopupWindow, PopupWindowSubmit } from './components/PopupWindow';

const DashboardButton = ({ children, className = '', onClick = () => { } }:
    { children?: React.ReactNode, className?: string, onClick?: () => void }) => {
    return (
        <button
            onClick={() => onClick()}
            className={`bg-neutral-900 text-neutral-100 py-1 px-2 rounded-md
                cursor-pointer hover:bg-neutral-700 duration-150 ${className}`}>
            {children}
        </button>
    );
}


const Dashboard = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const navPath = useNavPath().filter(s => s !== 'dashboard');
    const page = navPath.length >= 1 ? navPath[0] : null;
    const [hostname, setHostname] = useState('');

    useEffect(() => {
        getHostname().then(r => { if (r.status === 200) setHostname(r.data.hostname) })
    }, [])

    // might be a race condition here
    useEffect(() => { if (!user) navigate('/') }, [user, navigate]);

    const Devices = () => {
        return !user ? <></> : (
            <DashboardPage>
                <DashboardPageHeader>
                    {page}
                </DashboardPageHeader>
                <div className='flex mb-8'>
                    <p className='flex-1 flex'>
                        Manage the devices on your account.
                    </p>
                    <div className='flex-1 justify-end flex'>
                        <PopupWindowProvider>
                            <div className='flex justify-end'>
                                <DashboardButton>
                                    <PopupWindowToggle>
                                        Add this device
                                    </PopupWindowToggle>
                                </DashboardButton>
                            </div>
                            <PopupWindow>
                                <PopupWindowSubmit>
                                    <button
                                        onClick={() => authenticateDaemon(user.id)}
                                        className='font-bold text-4xl bg-neutral-800 p-4 rounded-lg
                                        cursor-pointer text-neutral-200 hover:bg-neutral-900'>
                                        Add this device
                                    </button>
                                </PopupWindowSubmit>
                            </PopupWindow>
                        </PopupWindowProvider>
                    </div>
                </div>
                <div>
                    <Table>
                        <TableHeader>
                            <TableHead>
                                Name
                            </TableHead>
                            <TableHead>
                                Last Login
                            </TableHead>
                            <TableHead>
                                Created
                            </TableHead>
                            <TableHead>
                                Daemon Status
                            </TableHead>
                            <TableHead>
                                Tunnel Status
                            </TableHead>
                            <TableHead />
                        </TableHeader>
                        <TableBody>
                            {
                                user.devices.map((d, i) => {
                                    return (
                                        <TableRow key={i}>
                                            <TableData>
                                                {
                                                    <div className='font-semibold mb-2'>
                                                        {d.displayName}
                                                    </div>
                                                }
                                                {
                                                    hostname === d.hostname &&
                                                    <div className='text-green-700'>
                                                        &gt; Current Machine
                                                    </div>
                                                }
                                            </TableData>
                                            <TableData>
                                                {
                                                    d.lastLogin
                                                }
                                            </TableData>
                                            <TableData>
                                                {
                                                    d.createdAt
                                                }
                                            </TableData>
                                            <TableData>
                                                {d.isDaemonOnline ? 'Online' : 'Offline'}
                                            </TableData>
                                            <TableData>
                                                {d.isTunnelOnline ? 'Online' : 'Offline'}
                                            </TableData>
                                            <TableData>
                                                <DropdownProvider>
                                                    <DropdownAnchor>
                                                        <DropdownToggle>
                                                            <img
                                                                src='/three-dots.svg'
                                                                className='w-6 cursor-pointer' />
                                                        </DropdownToggle>
                                                        <Dropdown offsetX={-50} offsetY={-150}>
                                                            <DropdownGroup>
                                                                <DropdownButton>
                                                                    Enable tunnel
                                                                </DropdownButton>
                                                                <DropdownButton>
                                                                    Rename
                                                                </DropdownButton>
                                                                <DropdownButton className='hover:bg-red-900'>
                                                                    Delete
                                                                </DropdownButton>
                                                            </DropdownGroup>
                                                        </Dropdown>
                                                    </DropdownAnchor>
                                                </DropdownProvider>
                                            </TableData>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            </DashboardPage >
        );
    }

    return user !== null ? (
        <DashboardLayout>
            <SidebarToggle className='absolute hover:bg-neutral-500 p-1 text-neutral-100
                rounded-md ml-4 z-0 left-0 top-3 bg-neutral-600'>
                <img src='/menu.svg' className='w-6 z-0' />
            </SidebarToggle>
            <div className='flex w-full h-full justify-center'>
                <div className='flex w-full max-w-[1300px] py-4 px-16'>
                    {
                        page === 'devices' &&
                        <Devices />
                    }
                </div>
            </div>
        </DashboardLayout >
    ) : <></>
}

export default Dashboard;
