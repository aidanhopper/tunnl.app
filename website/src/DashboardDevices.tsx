import { useUser } from './user';
import { useState, useRef } from 'react';
import { useNavPath } from './hooks';
import {
    DashboardPage, DashboardPageHeader, DashboardPageHeaderImage,
    DashboardPageDescription, DashboardPageDescriptionItem, DashboardPageDescriptionLink
} from './DashboardPage';
import { Table, TableHead, TableRow, TableBody, TableHeader, TableData, TableProvider } from './components/Table';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownButton, DropdownAnchor
} from './components/Dropdown';
import {
    authenticateDaemon, deleteDevice, updateDeviceName, startTunneler,
    stopTunneler, updateTunnelAutostart,
} from './API';
import {
    PopupWindowProvider, PopupWindowToggle, PopupWindow, PopupWindowSubmit,
    PopupWindowContainer, PopupWindowBody, PopupWindowForm, PopupWindowInput
} from './components/PopupWindow';
import { useNavigate, Link } from 'react-router-dom';

const StatusCircle = ({ className = '', children }: { className?: string, children?: React.ReactNode }) => {
    return (
        <div className='flex h-7 items-center font-semibold'>
            <div className={`shadow-white shadow-xl w-3 h-3 mr-3 rounded-full ${className}`} />
            {children}
        </div>
    );
}

const DashboardDevices = () => {
    const { user, setUser } = useUser();
    const navPath = useNavPath();
    const page = navPath.length >= 2 ? navPath[1] : null;
    const [isWaitingForTunneler, setIsWaitingForTunneler] = useState(false);
    const [renameWindowID, setRenameWindowID] = useState('');
    const renameWindowInputRef = useRef<HTMLInputElement>(null);
    const [deleteDeviceID, setDeleteDeviceID] = useState('');
    const isAddCreateDeviceWindowOpen = navPath.length >= 3 && navPath[2] === 'add';
    const navigate = useNavigate();
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
                        <PopupWindowContainer>
                            <PopupWindowBody className='mt-3'>
                                <PopupWindowForm onSubmit={(close) => {
                                    if (!renameWindowInputRef.current) return;
                                    if (renameWindowInputRef.current.value.trim() === '') return;
                                    updateDeviceName(renameWindowID, renameWindowInputRef.current.value.trim());
                                    close();
                                }}>
                                    <PopupWindowInput
                                        focus
                                        title='New device name'
                                        description='Enter a new name for the device.'
                                        ref={renameWindowInputRef}
                                        placeholder='eg. My Laptop'
                                    />
                                    <PopupWindowSubmit />
                                </PopupWindowForm>
                            </PopupWindowBody>
                        </PopupWindowContainer>
                    </PopupWindow>
                </PopupWindowProvider >
            }
            {
                isAddCreateDeviceWindowOpen &&
                <PopupWindowProvider initial>
                    <PopupWindow onClose={() => navigate('/dashboard/devices')}>
                        <PopupWindowContainer className='hover:bg-neutral-500 duration-150'>
                            <PopupWindowSubmit>
                                <a target='_blank' href={`http://localhost:45789/v1/authenticate/${encodeURIComponent(user.id)}`}
                                    className='font-bold text-4xl p-4 block cursor-pointer text-neutral-200'>
                                    Add this device
                                </a>
                            </PopupWindowSubmit>
                        </PopupWindowContainer>
                    </PopupWindow>
                </PopupWindowProvider>
            }
            <DashboardPage>
                <DashboardPageHeader>
                    <DashboardPageHeaderImage path='/devices-dark.svg' className='w-12' />
                    Devices
                </DashboardPageHeader>
                <DashboardPageDescription>
                    <DashboardPageDescriptionItem className='justify-center sm:justify-start'>
                        <p> Manage the devices on your account</p>
                    </DashboardPageDescriptionItem>
                    <DashboardPageDescriptionItem className='justify-center sm:justify-end'>
                        <DashboardPageDescriptionLink to='/dashboard/devices/add'>
                            Add this device
                        </DashboardPageDescriptionLink>
                    </DashboardPageDescriptionItem>
                </DashboardPageDescription>
                <TableProvider>
                    <Table>
                        <TableHeader>
                            <TableHead>
                                Device
                            </TableHead>
                            <TableHead>
                                DNS
                            </TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                            <TableHead>
                                Last Login
                            </TableHead>
                            <TableHead>
                                Created
                            </TableHead>
                            <TableHead className='w-16' />
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
                                                        <div className='font-bold'>
                                                            {d.displayName}
                                                        </div>
                                                    </div>
                                                }
                                            </TableData>
                                            <TableData>
                                                <code>{d.dnsIpRange}</code>
                                            </TableData>
                                            <TableData className='min-w-32 flex'>
                                                <div className='flex flex-1 flex-col mr-1'>
                                                    <span className='font-semibold h-1'>Daemon</span> &nbsp;
                                                    <span className='font-semibold h-1'>Tunnel</span> &nbsp;
                                                    <span className='font-semibold h-1'>Autostart</span> &nbsp;
                                                </div>
                                                <div className='flex flex-1 flex-col min-w-24'>
                                                    {
                                                        d.isDaemonOnline ?
                                                            <StatusCircle className='bg-green-500'>
                                                                Online
                                                            </StatusCircle>
                                                            : <StatusCircle className='bg-red-500'>
                                                                Offline
                                                            </StatusCircle>
                                                    }
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
                                                    {
                                                        d.isTunnelAutostart ?
                                                            <StatusCircle className='bg-green-500'>
                                                                On
                                                            </StatusCircle>
                                                            : <StatusCircle className='bg-red-500'>
                                                                Off
                                                            </StatusCircle>
                                                    }
                                                </div>
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
                                            <TableData className='w-16'>
                                                <DropdownProvider>
                                                    <DropdownAnchor>
                                                        <DropdownToggle>
                                                            <img
                                                                src='/three-dots.svg'
                                                                className='w-6 min-w-6 max-w-6 cursor-pointer' />
                                                        </DropdownToggle>
                                                        <Dropdown offsetX={-140} offsetY={-180} className='w-38'>
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
                                                                {
                                                                    d.isDaemonOnline &&
                                                                    <DropdownButton
                                                                        onClick={() => updateTunnelAutostart(d.id, !d.isTunnelAutostart)}>
                                                                        {
                                                                            d.isTunnelAutostart ?
                                                                                'Turn off autostart' :
                                                                                'Turn on autostart'
                                                                        }
                                                                    </DropdownButton>
                                                                }
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
                </TableProvider>
            </DashboardPage>
        </>
    );
}

export default DashboardDevices;
