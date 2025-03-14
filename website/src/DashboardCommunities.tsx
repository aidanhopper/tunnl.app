import { DashboardPage, DashboardPageHeader } from './DashboardPage';

export const DashboardCommunities = () => {
    return (
        <DashboardPage>
            <DashboardPageHeader>
                <img src='/communities-dark.svg' className='mt-1 w-10 mr-6' />
                <h1>
                    Communities
                </h1>
            </DashboardPageHeader>
        </DashboardPage>
    );
}

export default DashboardCommunities;
