import { useNavPath } from './hooks';
import { useUser } from './user';
import { Table, TableHead, TableRow, TableBody, TableHeader, TableData } from './components/Table';
import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownButton, DropdownAnchor
} from './components/Dropdown';

const Services = () => {
    const { user, setUser } = useUser();
    const navPath = useNavPath().filter(s => s !== 'dashboard');
    const page = navPath.length >= 1 ? navPath[0] : null;
    return !user ? <></> : (
        <div className='flex flex-col w-full h-full'>
            <div className='font-bold text-5xl mb-4'>
                <h1 className='capitalize'>
                    {
                        page && <>{page}</>
                    }
                </h1>
            </div>
            <div className='flex h-full text-lg flex-col'>
                <Table>
                    <TableHeader>
                        <TableHead>
                            Name
                        </TableHead>
                        <TableHead>
                            Last Seen
                        </TableHead>
                        <TableHead>
                            Status
                        </TableHead>
                        <TableHead>
                        </TableHead>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableData>
                                {user.devices[0].displayName}
                            </TableData>
                            <TableData>
                                {user.devices[0].lastLogin}
                            </TableData>
                            <TableData>
                                Online: {user.devices[0].isOnline ? <>True</> : <>False</>}
                            </TableData>
                            <TableData>
                                <DropdownProvider>
                                    <DropdownAnchor>
                                        <DropdownToggle>
                                            <img
                                                src='/three-dots.svg'
                                                className='w-6 cursor-pointer' />
                                        </DropdownToggle>
                                        <Dropdown offsetX={-30} offsetY={-110}>
                                            <DropdownGroup>
                                                <DropdownButton>
                                                    Rename
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
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default Services;
