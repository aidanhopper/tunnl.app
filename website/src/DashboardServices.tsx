import { DashboardPage, DashboardPageHeader } from './DashboardPage';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownButton, DropdownAnchor
} from './components/Dropdown';
import {
    PopupWindowProvider, PopupWindowToggle, PopupWindow, PopupWindowSelect,
    PopupWindowSelectToggle, PopupWindowSelectProvider, PopupWindowSelectOption,
    PopupWindowSubmit, PopupWindowHeader, PopupWindowContainer, PopupWindowFooter,
    PopupWindowBody, PopupWindowForm, PopupWindowInput, PopupWindowFormSubmit, PopupWindowFormSubmitButton
} from './components/PopupWindow';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useStoredState, useExistingStoredState } from './hooks';
import { useUser } from './user';

const CreateDeviceWindow = ({ isOpen, closeWindow = () => { } }:
    { isOpen: boolean, closeWindow: () => void }) => {
    const { user, setUser } = useUser();

    const [isScrollDisabled, setIsScrollDisabled] = useState(false);

    const [deviceSelectorText, setDeviceSelectorText] = useState('');

    const nameRef = useRef<HTMLInputElement>(null);
    const domainRef = useRef<HTMLInputElement>(null);
    const hostRef = useRef<HTMLInputElement>(null);
    const portRef = useRef<HTMLInputElement>(null);

    const onSubmit = (closeForm: () => void) => {
        if (!nameRef.current || !domainRef.current || !hostRef.current || !portRef.current) return;

        const service = {
            name: nameRef.current.value.trim(),
            domain: domainRef.current.value.trim(),
            host: hostRef.current.value.trim(),
            port: portRef.current.value.trim(),
        }

        let good = true;

        const errorColor = ' bg-red-100 ';

        let focusRef = null;

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

        if (focusRef) focusRef.focus();

        if (good) closeForm();
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
                                <PopupWindowSelectProvider>
                                    <PopupWindowSelectToggle onClick={() => setIsScrollDisabled(true)}>
                                        {deviceSelectorText === '' ? <>Select a device</> : <>{deviceSelectorText}</>}
                                    </PopupWindowSelectToggle>
                                    <PopupWindowSelect
                                        onClose={() => { setIsScrollDisabled(false) }}
                                        onSubmit={({ close, value }) => { setDeviceSelectorText(value); close() }}
                                    >
                                        {
                                            user.devices.map(d => {
                                                return (
                                                    <PopupWindowSelectOption value={d.displayName} />
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
    const [isCreateDeviceWindowOpen, setIsCreateDeviceWindowOpen] = useStoredState(
        'is create device window open',
        false
    );

    return (
        <>
            <CreateDeviceWindow
                isOpen={isCreateDeviceWindowOpen}
                closeWindow={() => setIsCreateDeviceWindowOpen(false)} />
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
                            <button
                                onClick={() => setIsCreateDeviceWindowOpen(true)}
                                className='rounded-md px-2 py-1 bg-neutral-600 hover:bg-neutral-500
                                duration-150 cursor-pointer text-neutral-100 whitespace-nowrap'>
                                Create a service
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                </div>
            </DashboardPage>
        </>
    );
}

export default DashboardServices;
