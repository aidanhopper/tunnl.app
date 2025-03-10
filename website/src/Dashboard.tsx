import { useNavigate } from 'react-router-dom';
import { useUser } from './user';
import { Sidebar, SidebarBody, SidebarProvider, SidebarToggle, SidebarFooter } from './components/Sidebar';
import { useEffect } from 'react';

const Layout = ({ children }: { children?: React.ReactNode }) => {
    const { user, setUser } = useUser();
    return user !== null ? (
        <div className='flex w-screen h-screen'>
            <SidebarProvider>
                <Sidebar expandedWidth={450} contractedWidth={100} className='bg-neutral-600 w-full'>
                    <SidebarBody>
                    </SidebarBody>
                    <SidebarFooter className='h-32 flex items-center justify-center'>
                        <img className='cursor-pointer bg-neutral-800 min-w-16 hover:border-neutral-400
                                                min-h-16 w-16 h-16 border-neutral-600 border-2 rounded-full duration-150'
                            src={user.picture} />
                    </SidebarFooter>
                </Sidebar>
                <div className='w-full h-full bg-neutral-300'>
                    {children}
                </div>
            </SidebarProvider>
        </div>
    ) : <></>;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    console.log(user)

    // might be a race condition here
    useEffect(() => { if (!user) navigate('/login') }, [user, navigate]);

    return user !== null ? (
        <Layout>
            <div>
                <SidebarToggle className='px-4 py-1 bg-neutral-600 text-neutral-100 rounded-md ml-4'>
                    Toggle
                </SidebarToggle>
            </div>
        </Layout>
    ) : <></>
}

export default Dashboard;
