import {
    DashboardPage, DashboardPageHeader, DashboardPageHeaderImage,
    DashboardPageDescription, DashboardPageDescriptionItem, DashboardPageDescriptionLink
} from './DashboardPage';
import { useUser } from './user';

const CommunityCard = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div
            style={{ scrollbarWidth: 'none' }}
            className='w-full h-96 bg-neutral-100 rounded-lg text-neutral-600 max-h-96'>
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
            <img
                src='/three-dots.svg'
                className='w-6 min-w-6 max-w-6 cursor-pointer' />
            {children}
        </div>
    )
}

const DashboardHome = () => {
    const { user, setUser } = useUser();
    return !user ? <></> : (
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
                                    </CommunityCardOptions>
                                </CommunityCardHeader>
                                <div className='flex flex-col mt-4 max-h-[285px]'>
                                    <div>
                                        <h2 className=' font-semibold px-4 text-xl'>
                                            Shares
                                        </h2>
                                    </div>
                                    <div
                                        className='overflow-y-scroll px-4 text-lg'
                                    >
                                        <p className='py-32'>asdf</p>
                                        <p className='py-32'>asdf</p>
                                        <p className='py-32'>asdf</p>
                                        <p className='py-32'>asdf</p>
                                    </div>
                                </div>
                            </CommunityCard>
                        )
                    })
                }
            </div>
            <div className='h-32 w-full' />
        </DashboardPage>
    );
}

export default DashboardHome;
