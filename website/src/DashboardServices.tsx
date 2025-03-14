import { DashboardPage, DashboardPageHeader } from './DashboardPage';
import {
    DropdownToggle, DropdownProvider, Dropdown, DropdownLink,
    DropdownGroup, DropdownButton, DropdownAnchor
} from './components/Dropdown';
import {
    PopupWindowProvider, PopupWindowToggle, PopupWindow, PopupWindowSelect,
    PopupWindowSelectToggle, PopupWindowSelectProvider, PopupWindowSelectOption,
    PopupWindowSubmit, PopupWindowHeader, PopupWindowContainer, PopupWindowFooter,
    PopupWindowBody, PopupWindowForm, PopupWindowInput, PopupWindowFormSubmit, PopupWindowFormSubmitButton
} from './components/PopupWindow';
import { Table, TableHead, TableRow, TableBody, TableHeader, TableData } from './components/Table';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useStoredState, useExistingStoredState } from './hooks';
import { useUser, Service } from './user';
import { useNavigate, Link } from 'react-router-dom';
import { useNavPath } from './hooks';
import { postService, deleteService, updateService } from './API';

const CreateDeviceWindow = ({ isOpen, closeWindow = () => { } }:
    { isOpen: boolean, closeWindow: () => void }) => {
    const { user, setUser } = useUser();

    const [isScrollDisabled, setIsScrollDisabled] = useState(false);

    const [deviceSelectorText, setDeviceSelectorText] = useState('');

    const nameRef = useRef<HTMLInputElement>(null);
    const domainRef = useRef<HTMLInputElement>(null);
    const hostRef = useRef<HTMLInputElement>(null);
    const portRef = useRef<HTMLInputElement>(null);

    const onSubmit = async (closeForm: () => void) => {
        if (!nameRef.current || !domainRef.current || !hostRef.current || !portRef.current || !user) return;

        const service = {
            name: nameRef.current.value.trim(),
            domain: domainRef.current.value.trim(),
            host: hostRef.current.value.trim(),
            port: portRef.current.value.trim(),
        }

        let good = true;

        const errorColor = ' bg-red-100 ';

        let focusRef = null;

        const setAllToRed = () => {
            if (!nameRef.current || !domainRef.current || !hostRef.current || !portRef.current || !user) return;
            nameRef.current.className += errorColor;
            domainRef.current.className += errorColor;
            hostRef.current.className += errorColor;
            portRef.current.className += errorColor;
        }

        if (service.name === '') {
            nameRef.current.className += errorColor;
            if (!focusRef) focusRef = nameRef.current;
            good = false;
        } else nameRef.current.className = nameRef.current.className.replace(errorColor, '');

        if (service.domain === '') {
            domainRef.current.className += errorColor;
            if (!focusRef) focusRef = domainRef.current;
            good = false;
        } else domainRef.current.className = nameRef.current.className.replace(errorColor, '');

        if (service.host === '') {
            hostRef.current.className += errorColor;
            if (!focusRef) focusRef = hostRef.current;
            good = false;
        } else hostRef.current.className = nameRef.current.className.replace(errorColor, '');

        if (service.port === '') {
            portRef.current.className += errorColor;
            if (!focusRef) focusRef = portRef.current;
            good = false;
        } else portRef.current.className = nameRef.current.className.replace(errorColor, '');

        if (deviceSelectorText === '') {
            good = false;
        }

        if (focusRef) focusRef.focus();

        if (!good) return;

        const hwid = user.devices.find(d => d.displayName === deviceSelectorText)?.id;

        if (!hwid) return;

        try {
            const response = await postService(hwid, service.name, service.domain, service.host, service.port);
            if (response.status === 201) closeForm();
        } catch {
            nameRef.current.focus();
            setAllToRed();
            return;
        }
    }

    return !isOpen || !user ? <></> : (
        <>
            <PopupWindowProvider initial>
                <PopupWindow onClose={closeWindow}>
                    <PopupWindowContainer>
                        <PopupWindowHeader className='pr-20'>
                            Create a Service
                        </PopupWindowHeader>
                        <PopupWindowBody disableScroll={isScrollDisabled}>
                            <PopupWindowForm onSubmit={onSubmit}>
                                <PopupWindowInput
                                    focus
                                    ref={nameRef}
                                    title='Service Name'
                                    description='The name of your service.'
                                    placeholder='eg. Minecraft Server'
                                />
                                <PopupWindowInput
                                    ref={domainRef}
                                    title='Domain'
                                    description='The domain of your service.'
                                    placeholder='eg. my.minecraft.server'
                                />
                                <PopupWindowInput
                                    ref={hostRef}
                                    title='Host'
                                    description='The host of your service relative to the selected device.'
                                    placeholder='eg. 127.0.0.1'
                                />
                                <PopupWindowInput
                                    ref={portRef}
                                    title='Port'
                                    description='The port your service is on.'
                                    placeholder='eg. 25565;80;443;55-100'
                                />
                                <h1 className='text-2xl font-bold'>Device</h1>
                                <PopupWindowSelectProvider>
                                    <PopupWindowSelectToggle onClick={() => setIsScrollDisabled(true)}>
                                        {deviceSelectorText === '' ? <>Select a device</> : <>{deviceSelectorText}</>}
                                    </PopupWindowSelectToggle>
                                    <PopupWindowSelect
                                        onClose={() => { setIsScrollDisabled(false) }}
                                        onSubmit={({ close, value }) => { setDeviceSelectorText(value); close() }}
                                    >
                                        {
                                            user.devices.map((d, i) => {
                                                return (
                                                    <PopupWindowSelectOption key={i} value={d.displayName} />
                                                );
                                            })
                                        }
                                    </PopupWindowSelect>
                                </PopupWindowSelectProvider>
                                <PopupWindowFormSubmit />
                            </PopupWindowForm>
                        </PopupWindowBody>
                        <PopupWindowFooter>
                            <PopupWindowFormSubmitButton onSubmit={onSubmit}>
                                Submit
                            </PopupWindowFormSubmitButton>
                        </PopupWindowFooter>
                    </PopupWindowContainer>
                </PopupWindow>
            </PopupWindowProvider>
        </>
    );
}

const EditDeviceWindow = ({ isOpen, closeWindow = () => { } }:
    { isOpen: boolean, closeWindow: () => void }) => {
    const { user, setUser } = useUser();
    const path = useNavPath();
    const service = path.length !== 4 ? null : user?.services.find(s => s.id === path[3]);

    const [isScrollDisabled, setIsScrollDisabled] = useState(false);
    const [deviceSelectorText, setDeviceSelectorText] = useState(user?.devices.find(d => d.id === service?.deviceid)?.displayName);

    const nameRef = useRef<HTMLInputElement>(null);
    const domainRef = useRef<HTMLInputElement>(null);
    const hostRef = useRef<HTMLInputElement>(null);
    const portRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setDeviceSelectorText(user?.devices.find(d => d.id === service?.deviceid)?.displayName);
    }, [service, user?.devices]);

    useEffect(() => {
        if (isOpen && !service) closeWindow();
    }, [isOpen, service, closeWindow]);

    const onSubmit = async (closeForm: () => void) => {
        if (!nameRef.current || !domainRef.current || !hostRef.current || !portRef.current || !user || !service) return;

        const deviceid = user.devices.find(d => d.displayName === deviceSelectorText)?.id;
        const s = {
            name: nameRef.current.value.trim() !== '' ? nameRef.current.value.trim() : null,
            domain: domainRef.current.value.trim() !== '' ? domainRef.current.value.trim() : null,
            host: hostRef.current.value.trim() !== '' ? hostRef.current.value.trim() : null,
            portRange: portRef.current.value.trim() !== '' ? portRef.current.value.trim() : null,
            deviceid: deviceid && deviceid !== service.deviceid ? deviceid : null,
        }

        const response = await updateService(service.id, s.name, s.domain, s.host, s.portRange, s.deviceid);
        if (response.status === 200)
            closeForm();
    }

    return !isOpen || !user || !service ? <></> : (
        <>
            <PopupWindowProvider initial>
                <PopupWindow onClose={closeWindow}>
                    <PopupWindowContainer>
                        <PopupWindowHeader className='pr-20'>
                            {service.name}
                        </PopupWindowHeader>
                        <PopupWindowBody disableScroll={isScrollDisabled}>
                            <PopupWindowForm onSubmit={onSubmit}>
                                <p className='text-base font-normal mb-4'>Leave fields you want to stay the same blank.</p>
                                <PopupWindowInput
                                    focus
                                    ref={nameRef}
                                    title='Service Name'
                                    placeholder={service.name}
                                />
                                <PopupWindowInput
                                    ref={domainRef}
                                    title='Domain'
                                    placeholder={service.domain}
                                />
                                <PopupWindowInput
                                    ref={hostRef}
                                    title='Host'
                                    placeholder={service.host}
                                />
                                <PopupWindowInput
                                    ref={portRef}
                                    title='Port'
                                    placeholder={service.portRange}
                                />
                                <h1 className='text-2xl font-bold'>Device</h1>
                                <PopupWindowSelectProvider>
                                    <PopupWindowSelectToggle onClick={() => setIsScrollDisabled(true)}>
                                        {deviceSelectorText}
                                    </PopupWindowSelectToggle>
                                    <PopupWindowSelect
                                        onClose={() => { setIsScrollDisabled(false) }}
                                        onSubmit={({ close, value }) => { setDeviceSelectorText(value); close() }}
                                    >
                                        {
                                            user.devices.map((d, i) => {
                                                return (
                                                    <PopupWindowSelectOption key={i} value={d.displayName} />
                                                );
                                            })
                                        }
                                    </PopupWindowSelect>
                                </PopupWindowSelectProvider>
                                <PopupWindowFormSubmit />
                            </PopupWindowForm>
                        </PopupWindowBody>
                        <PopupWindowFooter>
                            <PopupWindowFormSubmitButton onSubmit={onSubmit}>
                                Submit
                            </PopupWindowFormSubmitButton>
                        </PopupWindowFooter>
                    </PopupWindowContainer>
                </PopupWindow>
            </PopupWindowProvider>
        </>
    );
}

const DashboardServices = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const navPath = useNavPath()
    const isCreateDeviceWindowOpen = navPath.length >= 3 && navPath[2] === 'create';
    const isEditDeviceWindowOpen = navPath.length === 4 && navPath[2] === 'edit';
    const [deleteServiceID, setDeleteServiceID] = useState('');
    return !user ? <></> : (
        <>
            {
                deleteServiceID !== '' &&
                <PopupWindowProvider initial>
                    <PopupWindow onClose={() => setDeleteServiceID('')}>
                        <PopupWindowContainer>
                            <PopupWindowHeader>
                                Are you sure?
                            </PopupWindowHeader>
                            <PopupWindowBody className='p-0 m-0'>
                                <PopupWindowForm onSubmit={async (close) => { await deleteService(deleteServiceID); close() }}>
                                    <PopupWindowSubmit>
                                        <div className='w-full py-5 px-2 rounded-md my-6 text-center
                                        hover:bg-red-500 font-bold duration-150 rounded cursor-pointer'>
                                            yes
                                        </div>
                                    </PopupWindowSubmit>
                                </PopupWindowForm>
                            </PopupWindowBody>
                        </PopupWindowContainer>
                    </PopupWindow>
                </PopupWindowProvider>
            }
            <CreateDeviceWindow
                isOpen={isCreateDeviceWindowOpen}
                closeWindow={() => navigate('/dashboard/services')} />
            <EditDeviceWindow
                isOpen={isEditDeviceWindowOpen}
                closeWindow={() => navigate('/dashboard/services')} />
            <DashboardPage>
                <DashboardPageHeader>
                    <img src='/services-dark.svg' className='mt-1 w-12 mr-4' />
                    <h1>
                        Services
                    </h1>
                </DashboardPageHeader>
                <div className='flex mb-8'>
                    <div className='flex-1 flex items-center'>
                        <p>
                            Manage and create services that you can share.
                        </p>
                    </div>
                    <div className='flex-1 flex justify-end'>
                        <div>
                            <Link
                                to='/dashboard/services/create'
                                className='rounded-md px-3 py-2 bg-neutral-600 hover:bg-neutral-500
                                duration-150 cursor-pointer text-neutral-100 whitespace-nowrap'>
                                Create a service
                            </Link>
                        </div>
                    </div>
                </div>
                <div>
                    <Table>
                        <TableHeader>
                            <TableHead>
                                Service
                            </TableHead>
                            <TableHead>
                                Domain
                            </TableHead>
                            <TableHead>
                                Host
                            </TableHead>
                            <TableHead>
                                Ports
                            </TableHead>
                            <TableHead>
                                Device
                            </TableHead>
                            <TableHead>
                                Created
                            </TableHead>
                            <TableHead />
                        </TableHeader>
                        <TableBody>
                            {
                                user.services.map((s, i) => {
                                    const created = new Date(s.createdAt).toLocaleDateString();
                                    return (
                                        <TableRow key={i}>
                                            <TableData className='font-semibold'>
                                                {s.name}
                                            </TableData>
                                            <TableData>
                                                {s.domain}
                                            </TableData>
                                            <TableData>
                                                {s.host}
                                            </TableData>
                                            <TableData>
                                                {
                                                    s.portRange.split(';').map((p, idx) => {
                                                        return (
                                                            <div key={idx}>
                                                                {p}
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </TableData>
                                            <TableData>
                                                {user.devices.find(d => d.id === s.deviceid)?.displayName}
                                            </TableData>
                                            <TableData>
                                                {created}
                                            </TableData>
                                            <TableData>
                                                <DropdownProvider>
                                                    <DropdownAnchor>
                                                        <DropdownToggle>
                                                            <img
                                                                src='/three-dots.svg'
                                                                className='w-6 min-w-6 max-w-6 cursor-pointer' />
                                                        </DropdownToggle>
                                                        <Dropdown offsetX={-135} offsetY={10} className='w-38'>
                                                            <DropdownGroup>
                                                                <DropdownLink
                                                                    to={`/dashboard/services/edit/${encodeURIComponent(s.id)}`}>
                                                                    Edit
                                                                </DropdownLink>
                                                                <DropdownButton
                                                                    onClick={() => setDeleteServiceID(s.id)}
                                                                    className='hover:bg-red-900'>
                                                                    Delete
                                                                </DropdownButton>
                                                            </DropdownGroup>
                                                        </Dropdown>
                                                    </DropdownAnchor>
                                                </DropdownProvider>
                                            </TableData>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </div>
            </DashboardPage>
        </>
    );
}

export default DashboardServices;
