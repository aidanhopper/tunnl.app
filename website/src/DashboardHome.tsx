import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownButton, DropdownAnchor, DropdownLink
} from './components/Dropdown';
import { useNavigate } from 'react-router-dom';
import { TableData } from './components/Table';
import {
    DashboardPage, DashboardPageHeader, DashboardPageHeaderImage,
    DashboardPageDescription, DashboardPageDescriptionItem, DashboardPageDescriptionLink
} from './DashboardPage';
import {
    PopupWindowProvider, PopupWindowToggle, PopupWindow, PopupWindowSubmit,
    PopupWindowContainer, PopupWindowBody, PopupWindowForm, PopupWindowInput
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
        <div className='flex-1 text-xl font-bold p-4'>
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

const DashboardHome = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();
    const path = useNavPath();
    const shareWindowId = path.length === 4 && path[3] === 'share' ? path[2] : null;
    return !user ? <></> : (
        <>
            {
                shareWindowId &&
                <PopupWindowProvider initial>
                    <PopupWindow onClose={() => navigate('/dashboard')}>
                        <PopupWindowContainer>
                            <PopupWindowBody>
                                {shareWindowId}
                            </PopupWindowBody>
                        </PopupWindowContainer>
                    </PopupWindow>
                </PopupWindowProvider>
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
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 '>
                    {
                        user.memberships.map((m, i) => {
                            console.log(m.id)
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
                                                    <DropdownLink
                                                        to={`/dashboard/membership/${m.id}/share`}>
                                                        Share
                                                    </DropdownLink>
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
                                        <div className='flex flex-col flex-1 overflow-y-scroll px-4 text-lg'>
                                        </div>
                                    </div>
                                </CommunityCard>
                            )
                        })
                    }
                </div>
                <div className='h-32 w-full' />
            </DashboardPage >
        </>
    );
}

export default DashboardHome;
