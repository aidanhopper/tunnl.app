import { useNavigate } from 'react-router-dom';
import { useUser } from './user';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownButton, DropdownAnchor
} from './components/Dropdown';
import {
    DashboardPage, DashboardPageHeader, DashboardPageHeaderImage,
    DashboardPageDescription, DashboardPageDescriptionItem, DashboardPageDescriptionLink
} from './DashboardPage';
import {
    PopupWindowProvider, PopupWindowToggle, PopupWindow, PopupWindowSelect,
    PopupWindowSelectToggle, PopupWindowSelectProvider, PopupWindowSelectOption,
    PopupWindowSubmit, PopupWindowHeader, PopupWindowContainer, PopupWindowFooter,
    PopupWindowBody, PopupWindowForm, PopupWindowInput, PopupWindowFormSubmit, PopupWindowFormSubmitButton
} from './components/PopupWindow';
import {
    Table, TableHead, TableRow, TableBody,
    TableHeader, TableData, TableProvider
} from './components/Table';
import { useNavPath } from './hooks';
import { useRef } from 'react';
import { postCommunity, postInvite } from './API';

const Create = () => {
    const navigate = useNavigate();
    const nameRef = useRef<HTMLInputElement>(null);

    const onSubmit = async (close: () => void) => {
        if (!nameRef.current) return
        const name = nameRef.current.value.trim()
        console.log(name);
        if (name === '') return;
        await postCommunity(name);
        close();
    }

    return (
        <PopupWindowProvider initial>
            <PopupWindow onClose={() => navigate('/dashboard/communities')}>
                <PopupWindowContainer>
                    <PopupWindowHeader>
                        Create a community
                    </PopupWindowHeader>
                    <PopupWindowBody>
                        <PopupWindowForm onSubmit={onSubmit}>
                            <PopupWindowInput
                                focus
                                ref={nameRef}
                                title='Name'
                                placeholder='eg. my gregtech community' />
                            <PopupWindowFormSubmitButton>
                                Create
                            </PopupWindowFormSubmitButton>
                        </PopupWindowForm>
                    </PopupWindowBody>
                    <PopupWindowFooter />
                </PopupWindowContainer>
            </PopupWindow>
        </PopupWindowProvider>
    );
}

const DashboardCommunities = () => {
    const path = useNavPath();
    const isCreateCommunityWindowOpen = path.length === 3 && path[2] === 'create';
    const { user, setUser } = useUser();
    return !user ? <></> : (
        <>
            {
                isCreateCommunityWindowOpen &&
                <Create />
            }
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
                        <DashboardPageDescriptionLink to='/dashboard/communities/create'>
                            Create a community
                        </DashboardPageDescriptionLink>
                    </DashboardPageDescriptionItem>
                </DashboardPageDescription>
                <TableProvider>
                    <Table>
                        <TableHeader>
                            <TableHead>
                                Name
                            </TableHead>
                            <TableHead>
                                Created
                            </TableHead>
                            <TableHead className='w-16' />
                        </TableHeader>
                        <TableBody>
                            {
                                user.communities.map((c, i) => {
                                    const created = new Date(c.createdAt).toLocaleDateString();
                                    return (
                                        <TableRow key={i}>
                                            <TableData>
                                                {c.name}
                                            </TableData>
                                            <TableData>
                                                {created}
                                            </TableData>
                                            <TableData className='w-16'>
                                                <DropdownProvider>
                                                    <DropdownToggle>
                                                        <img
                                                            src='/three-dots.svg'
                                                            className='w-6 min-w-6 max-w-6 cursor-pointer' />
                                                    </DropdownToggle>
                                                    <DropdownAnchor>
                                                        <Dropdown offsetX={-140} offsetY={-150} className='w-38'>
                                                            <DropdownGroup className=''>
                                                                <DropdownButton>
                                                                    Rename
                                                                </DropdownButton>
                                                                <DropdownButton onClick={async () => {
                                                                    const date = new Date();
                                                                    date.setDate(date.getDate() + 5);
                                                                    const response = await postInvite(c.id, false, date);
                                                                    console.log(response.data);
                                                                }}>
                                                                    Invite
                                                                </DropdownButton>
                                                                <DropdownButton className='hover:bg-red-900'>
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

export default DashboardCommunities;
