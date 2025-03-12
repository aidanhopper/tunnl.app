import { useNavigate } from 'react-router-dom';
import { useUser } from './user';
import { SidebarToggle } from './components/Sidebar';
import { useEffect, useState, useRef } from 'react';
import DashboardLayout from './DashboardLayout';
import { useNavPath } from './hooks';
import { DashboardPage, DashboardPageHeader } from './DashboardPage';
import { Table, TableHead, TableRow, TableBody, TableHeader, TableData } from './components/Table';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownButton, DropdownAnchor
} from './components/Dropdown';
import { authenticateDaemon, getHostname, deleteDevice, updateDeviceName, startTunneler, stopTunneler } from './API';
import { PopupWindowProvider, PopupWindowToggle, PopupWindow, PopupWindowSubmit } from './components/PopupWindow';

const StatusCircle = ({ className = '', children }: { className?: string, children?: React.ReactNode }) => {
    return (
        <div className='w-full h-full flex justify-left items-center font-semibold'>
            <div className={`mr-4 shadow-white shadow-xl w-3 h-3 rounded-full ${className}`} />
            {children}
        </div>
    );
}

const DashboardButton = ({ children, className = '', onClick = () => { } }:
    { children?: React.ReactNode, className?: string, onClick?: () => void }) => {
    return (
        <button
            onClick={() => onClick()}
            className={`bg-neutral-600 text-neutral-100 py-1 px-3 rounded-md
                cursor-pointer hover:bg-neutral-500 duration-150 text-sm ${className}`}>
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
    const [renameWindowID, setRenameWindowID] = useState('');
    const [deleteDeviceID, setDeleteDeviceID] = useState('');
    const renameWindowInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getHostname().then(r => { if (r.status === 200) setHostname(r.data.hostname) });
    }, [])

    // might be a race condition here
    useEffect(() => { if (!user) navigate('/') }, [user, navigate]);

    const Devices = () => {
        const [isWaitingForTunneler, setIsWaitingForTunneler] = useState(false);
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
                                                {d.isDaemonOnline ?
                                                    <StatusCircle className='bg-green-500'>
                                                        Online
                                                    </StatusCircle>
                                                    : <StatusCircle className='bg-red-500'>
                                                        Offline
                                                    </StatusCircle>}
                                            </TableData>
                                            <TableData>
                                                {
                                                    isWaitingForTunneler ?
                                                        <StatusCircle className='bg-yellow-600'>
                                                            Waiting...
                                                        </StatusCircle> :
                                                        d.isTunnelOnline ?
                                                            <StatusCircle className='bg-green-500'>
                                                                Online
                                                            </StatusCircle>
                                                            : <StatusCircle className='bg-red-500'>
                                                                Offline
                                                            </StatusCircle>
                                                }
                                            </TableData>
                                            <TableData>
                                                <DropdownProvider>
                                                    <DropdownAnchor>
                                                        <DropdownToggle>
                                                            <img
                                                                src='/three-dots.svg'
                                                                className='w-6 min-w-6 max-w-6 cursor-pointer' />
                                                        </DropdownToggle>
                                                        <Dropdown offsetX={-50} offsetY={-150} className='w-28'>
                                                            <DropdownGroup>
                                                                {
                                                                    d.isDaemonOnline &&
                                                                    <DropdownButton onClick={
                                                                        d.isTunnelOnline ?
                                                                            async () => await stopTunneler(d.id) :
                                                                            async () => {
                                                                                setIsWaitingForTunneler(true);
                                                                                await startTunneler(d.id)
                                                                                setIsWaitingForTunneler(false);
                                                                            }
                                                                    }>
                                                                        {
                                                                            d.isTunnelOnline ?
                                                                                <>
                                                                                    Stop Tunnel
                                                                                </> :
                                                                                <>
                                                                                    Start Tunnel
                                                                                </>
                                                                        }
                                                                    </DropdownButton>
                                                                }
                                                                <DropdownButton
                                                                    onClick={() => setRenameWindowID(d.id)}>
                                                                    Rename
                                                                </DropdownButton>
                                                                <DropdownButton
                                                                    onClick={() => setDeleteDeviceID(d.id)}
                                                                    className='hover:bg-red-900'>
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
            </DashboardPage>
        );
    }

    return user !== null ? (
        <>
            {
                renameWindowID !== '' &&
                <PopupWindowProvider initial>
                    <PopupWindow onClose={() => setRenameWindowID('')}>
                        <div className='bg-neutral-600 text-neutral-200 rounded-lg'>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (!renameWindowInputRef.current) return;
                                if (renameWindowInputRef.current.value.trim() === '') return;
                                updateDeviceName(renameWindowID, renameWindowInputRef.current.value.trim());
                            }}>
                                <label className='flex flex-col p-2'>
                                    <input
                                        autoFocus
                                        ref={renameWindowInputRef}
                                        className='bg-neutral-200 text-neutral-600 rounded p-1'
                                        placeholder='New name' />
                                </label>
                                <PopupWindowToggle>
                                    <button type='submit' className='hidden' />
                                </PopupWindowToggle>
                            </form>
                        </div>
                    </PopupWindow>
                </PopupWindowProvider >
            }
            {
                deleteDeviceID !== '' &&
                <PopupWindowProvider initial>
                    <PopupWindow onClose={() => setDeleteDeviceID('')}>
                        <div className='bg-neutral-600 text-neutral-200 rounded-lg flex flex-col'>
                            <h1 className='font-bold text-2xl p-4'>
                                Are you sure?
                            </h1>
                            <div className='flex w-full h-12 p-1'>
                                <PopupWindowToggle>
                                    <button className='flex-1 w-full h-full bg-red-700 rounded 
                                        mr-1 cursor-pointer' onClick={() => {
                                            deleteDevice(deleteDeviceID);
                                        }}>
                                        Yes
                                    </button>
                                </PopupWindowToggle>
                                <PopupWindowToggle>
                                    <button className='flex-1 w-full h-full bg-neutral-800
                                        rounded cursor-pointer'>
                                        No
                                    </button>
                                </PopupWindowToggle>
                            </div>
                        </div>
                    </PopupWindow>
                </PopupWindowProvider >
            }
            <DashboardLayout>
                <SidebarToggle className='absolute hover:bg-neutral-500 p-1 text-neutral-100
                rounded-md ml-4 z-0 left-0 top-3 bg-neutral-600'>
                    <img src='/menu.svg' className='w-6 z-0' />
                </SidebarToggle>
                <div className='flex w-full h-full justify-center'>
                    <div className='flex w-full'>
                        {
                            page === 'devices' &&
                            <Devices />
                        }
                    </div>
                </div>
            </DashboardLayout>
        </>
    ) : <></>
}

export default Dashboard;
