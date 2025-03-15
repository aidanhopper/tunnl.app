import {
    DashboardPage, DashboardPageHeader, DashboardPageHeaderImage,
    DashboardPageDescription, DashboardPageDescriptionItem, DashboardPageDescriptionLink
} from './DashboardPage';

export const DashboardCommunities = () => {
    return (
        <DashboardPage>
            <DashboardPageHeader>
                <DashboardPageHeaderImage path='/communities-dark.svg' />
                Communities
            </DashboardPageHeader>
            <DashboardPageDescription>
                <DashboardPageDescriptionItem className='justify-center sm:justify-start'>
                    <p>Manage and create services that you can share.</p>
                </DashboardPageDescriptionItem>
                <DashboardPageDescriptionItem className='justify-center sm:justify-end'>
                    <DashboardPageDescriptionLink to='/dashboard/communities'>
                        Create a community
                    </DashboardPageDescriptionLink>
                </DashboardPageDescriptionItem>
            </DashboardPageDescription>
        </DashboardPage>
    );
}

export default DashboardCommunities;
