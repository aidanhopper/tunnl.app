import { useUser } from './user';
import { useState, useRef } from 'react';
import { useNavPath } from './hooks';
import { DashboardPage, DashboardPageHeader } from './DashboardPage';
import { Table, TableHead, TableRow, TableBody, TableHeader, TableData } from './components/Table';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownButton, DropdownAnchor
} from './components/Dropdown';
import { authenticateDaemon, deleteDevice, updateDeviceName, startTunneler, stopTunneler } from './API';
import { PopupWindowProvider, PopupWindowToggle, PopupWindow, PopupWindowSubmit } from './components/PopupWindow';

const StatusCircle = ({ className = '', children }: { className?: string, children?: React.ReactNode }) => {
    return (
        <div className='w-full h-full flex justify-left items-center font-semibold'>
            <div className={`mr-4 shadow-white shadow-xl w-3 h-3 rounded-full ${className}`} />
            {children}
        </div>
    );
}

const DashboardDevices = () => {
    const { user, setUser } = useUser();
    const navPath = useNavPath().filter(s => s !== 'dashboard');
    const page = navPath.length >= 1 ? navPath[0] : null;
    const [isWaitingForTunneler, setIsWaitingForTunneler] = useState(false);
    const [renameWindowID, setRenameWindowID] = useState('');
    const renameWindowInputRef = useRef<HTMLInputElement>(null);
    const [deleteDeviceID, setDeleteDeviceID] = useState('');
    return !user ? <></> : (
        <>
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
                </PopupWindowProvider>
            }
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
            <DashboardPage>
                <DashboardPageHeader>
                    <img src='/devices-dark.svg' className='mt-1 w-12 mr-4' />
                    <h1>
                        Devices
                    </h1>
                </DashboardPageHeader>
                <div className='flex mb-8 flex-col sm:flex-row'>
                    <p className='flex-1 flex items-center whitespace-nowrap'>
                        Manage the devices on your account.
                    </p>
                    <div className='flex-1 justify-start sm:justify-end flex'>
                        <PopupWindowProvider>
                            <div className='flex mt-4 sm:mt-0 sm:justify-end'>
                                <button className='bg-neutral-600 text-neutral-100 px-2 py-1
                                    rounded-md w-full sm:w-fit cursor-pointer duration-150 hover:bg-neutral-500'>
                                    <PopupWindowToggle>
                                        Add this device
                                    </PopupWindowToggle>
                                </button>
                            </div>
                            <PopupWindow>
                                <PopupWindowSubmit>
                                    <a target='_blank' href={`http://localhost:45789/v1/authenticate/${encodeURIComponent(user.id)}`}
                                        className='font-bold text-4xl bg-neutral-800 p-4 rounded-lg
                                        cursor-pointer text-neutral-200 hover:bg-neutral-900'>
                                        Add this device
                                    </a>
                                </PopupWindowSubmit>
                            </PopupWindow>
                        </PopupWindowProvider>
                    </div>
                </div>
                <div>
                    <Table>
                        <TableHeader>
                            <TableHead>
                                Device
                            </TableHead>
                            <TableHead>
                                Last Login
                            </TableHead>
                            <TableHead>
                                Created
                            </TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                            <TableHead />
                        </TableHeader>
                        <TableBody>
                            {
                                user.devices.map((d, i) => {
                                    const lastLogin = new Date(d.lastLogin).toLocaleDateString();
                                    const createdAt = new Date(d.createdAt).toLocaleDateString();
                                    return (
                                        <TableRow key={i}>
                                            <TableData>
                                                {
                                                    <div>
                                                        <div className='font-semibold'>
                                                            {d.displayName}
                                                        </div>
                                                        <div>
                                                            <span className='font-semibold'>DNS</span> &nbsp; &nbsp;
                                                            <code>{d.dnsIpRange}</code>
                                                        </div>
                                                        <div>
                                                            <span className='font-semibold'>Autostart Tunnel</span> &nbsp; &nbsp;
                                                            {d.isTunnelAutostart ? <>On</> : <>Off</>}
                                                        </div>
                                                    </div>
                                                }
                                            </TableData>
                                            <TableData>
                                                {
                                                    lastLogin
                                                }
                                            </TableData>
                                            <TableData>
                                                {
                                                    createdAt
                                                }
                                            </TableData>
                                            <TableData className='min-w-32'>
                                                <h2 className='font-bold'>Daemon</h2>
                                                {d.isDaemonOnline ?
                                                    <StatusCircle className='bg-green-500'>
                                                        Online
                                                    </StatusCircle>
                                                    : <StatusCircle className='bg-red-500'>
                                                        Offline
                                                    </StatusCircle>
                                                }
                                                <h2 className='font-bold mt-3'>Tunnel</h2>
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
                                                        <Dropdown offsetX={-85} offsetY={10} className='w-28'>
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
        </>
    );
}

export default DashboardDevices;
