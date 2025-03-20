import { deleteMember, postService, postShare, deleteShare } from './API';
import { Share } from './user';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownButton, DropdownAnchor, DropdownLink
} from './components/Dropdown';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TableData } from './components/Table';
import {
    DashboardPage, DashboardPageHeader, DashboardPageHeaderImage,
    DashboardPageDescription, DashboardPageDescriptionItem, DashboardPageDescriptionLink
} from './DashboardPage';
import {
    PopupWindowProvider, PopupWindowToggle, PopupWindow, PopupWindowFormSubmit,
    PopupWindowContainer, PopupWindowBody, PopupWindowForm, PopupWindowInput,
    PopupWindowSelect, PopupWindowSelectToggle, PopupWindowSelectOption, PopupWindowSelectProvider
} from './components/PopupWindow';
import { useUser } from './user';
import { useNavPath } from './hooks';

const CommunityCard = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='flex flex-col w-full h-[500px] bg-neutral-100 rounded-lg text-neutral-600 shadow'>
            {children}
        </div>
    );
}

const CommunityCardName = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='flex-1 text-lg font-bold p-4'>
            <h1 className='inline-block bg-neutral-200 rounded-md px-2 py-1'>
                {children}
            </h1>
        </div>
    );
}

const CommunityCardHeader = ({ children, className = '' }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={`flex items-center ${className}`}>
            {children}
        </div>
    );
}

const CommunityCardMemberCount = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='flex items-center text-lg pr-2'>
            <img src='/headshot.svg' className='w-6 mr-2' />
            {children}
        </div>
    );
}

const CommunityCardOptions = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='flex pr-2'>
            <DropdownProvider>
                <DropdownAnchor>
                    <DropdownToggle>
                        <img
                            src='/three-dots.svg'
                            className='w-6 min-w-6 max-w-6 cursor-pointer' />
                    </DropdownToggle>
                    {children}
                </DropdownAnchor>
            </DropdownProvider>
        </div>
    )
}

const ShareWindow = () => {
    const navigate = useNavigate();
    const [selectedVal, setSelectedVal] = useState('');
    const { user, setUser } = useUser();
    const path = useNavPath();
    const shareWindowId = path.length === 4 && path[3] === 'share' ? path[2] : null;

    const handleSubmit = async (close: () => void) => {
        if (selectedVal === '' || !user || !shareWindowId) return;

        const serviceid = user.services.find(s => s.name === selectedVal)?.id;
        if (!serviceid) return;

        const response = await postShare(serviceid, shareWindowId);

        if (response.status !== 201) return;

        close();
    }

    return !user ? <></> : (
        <PopupWindowProvider initial>
            <PopupWindow onClose={() => navigate('/dashboard')}>
                <PopupWindowContainer className='w-96'>
                    <PopupWindowBody>
                        <PopupWindowForm onSubmit={handleSubmit}>
                            <div className='h-[320px]' />
                            <PopupWindowSelectProvider initial>
                                <PopupWindowSelectToggle>
                                    {selectedVal === '' ? 'Select a service to share' : selectedVal}
                                </PopupWindowSelectToggle>
                                <PopupWindowSelect onSubmit={({ close, value }) => {
                                    setSelectedVal(value);
                                    close();
                                }}>
                                    {
                                        user.services.map((s, i) => {
                                            return (
                                                <PopupWindowSelectOption key={i} value={s.name} />
                                            );
                                        })
                                    }
                                </PopupWindowSelect>
                            </PopupWindowSelectProvider>
                            <button
                                type='submit'
                                className='w-full h-12 flex justify-center items-center bg-neutral-700 
                                                mb-4 rounded-md hover:bg-neutral-800 cursor-pointer'>
                                Share
                            </button>
                        </PopupWindowForm>
                    </PopupWindowBody>
                </PopupWindowContainer>
            </PopupWindow>
        </PopupWindowProvider >
    );
}

const ShareRow = ({ s }: { s: Share }) => {
    const { user, setUser } = useUser();
    console.log(user);
    return !user ? <></> : (
        <div
            className='w-full grid grid-cols-4 text-base py-2 px-1
            border-t-[1px] border-neutral-300 hover:bg-neutral-200
            duration-150'>
            <h2 className='font-semibold'>
                Name
            </h2>
            <div className='col-span-3 flex'>
                <div className='flex-1'>
                    {s.service.name}
                </div>
                <div className=''>
                    {
                        s.service.ownerid === user.id ?
                            <>
                                <DropdownProvider>
                                    <DropdownToggle>
                                        <img
                                            src='/three-dots.svg'
                                            className='w-4 min-w-4 
                                            max-w-6 cursor-pointer' />
                                    </DropdownToggle>
                                    <Dropdown offsetX={-70} offsetY={-40}>
                                        <DropdownGroup>
                                            <DropdownButton
                                                onClick={() => deleteShare(s.id)}
                                                className='hover:bg-red-900'>
                                                Delete
                                            </DropdownButton>
                                        </DropdownGroup>
                                    </Dropdown>
                                </DropdownProvider>
                            </> :
                            <></>
                    }
                </div>
            </div>
            <h2 className='font-semibold'>
                Domain
            </h2>
            <div className='col-span-3'>
                {s.service.domain}
            </div>
            <h2 className='font-semibold'>
                Ports
            </h2>
            <div className='col-span-3'>
                {s.service.portRange}
            </div>
        </div>
    );
}

const DashboardHome = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const path = useNavPath();
    const shareWindowId = path.length === 4 && path[3] === 'share' ? path[2] : null;
    return !user ? <></> : (
        <>
            {
                shareWindowId &&
                <ShareWindow />
            }
            <DashboardPage>
                <DashboardPageHeader>
                    <DashboardPageHeaderImage path='/home-dark.svg' />
                    Memberships
                </DashboardPageHeader>
                <DashboardPageDescription>
                    <DashboardPageDescriptionItem>
                        Communities you've joined and their services
                    </DashboardPageDescriptionItem>
                </DashboardPageDescription>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-8'>
                    {
                        user.memberships.map((m, i) => {
                            const shares: Share[] = [];
                            m.community.members.forEach(m => { m.shares.forEach(s => { shares.push(s) }) });
                            const isOwner = user.communities.find(com => com.id === m.community.id) !== undefined;
                            console.log(isOwner)
                            return (
                                <CommunityCard key={i}>
                                    <CommunityCardHeader className=''>
                                        <CommunityCardName>
                                            {m.community.name}
                                        </CommunityCardName>
                                        <CommunityCardMemberCount>
                                            {m.community.members.length}
                                        </CommunityCardMemberCount>
                                        <CommunityCardOptions>
                                            <Dropdown offsetX={-60} offsetY={10}>
                                                <DropdownGroup>
                                                    {
                                                        user.services.length !== 0 &&
                                                        <DropdownLink
                                                            to={`/dashboard/membership/${m.id}/share`}>
                                                            Share
                                                        </DropdownLink>
                                                    }
                                                    <DropdownButton
                                                        onClick={async () => await deleteMember(m.id)}
                                                        className='hover:bg-red-900'>
                                                        Leave
                                                    </DropdownButton>
                                                </DropdownGroup>
                                            </Dropdown>
                                        </CommunityCardOptions>
                                    </CommunityCardHeader>
                                    <div className='flex flex-col mt-4 flex-1 overflow-hidden pb-4'>
                                        <div className=''>
                                            <h2 className=' font-semibold px-4 text-xl'>
                                                Shares
                                            </h2>
                                        </div>
                                        <div className='flex flex-col flex-1 overflow-auto px-4 text-lg pt-2'>
                                            {
                                                shares.length === 0 ?
                                                    <div className='flex justify-center items-center font-bold w-full h-full'>
                                                        No shares &nbsp; 😞
                                                    </div> :
                                                    <>
                                                        {
                                                            shares.map((s, i) => {
                                                                return <ShareRow s={s} key={i} />
                                                            })
                                                        }
                                                    </>
                                            }

                                        </div>
                                    </div>
                                </CommunityCard >
                            )
                        })
                    }
                </div >
                <div className='h-32 w-full' />
            </DashboardPage>
        </>
    );
}

export default DashboardHome;
