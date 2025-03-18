import { useNavigate } from 'react-router-dom';
import { useUser } from './user';
import { SidebarToggle } from './components/Sidebar';
import { useEffect, useState, useRef } from 'react';
import DashboardLayout from './DashboardLayout';
import { useNavPath } from './hooks';
import DashboardDevices from './DashboardDevices';
import DashboardServices from './DashboardServices';
import DashboardCommunities from './DashboardCommunities';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, setUser } = useUser();
    const navPath = useNavPath().filter(s => s !== 'dashboard');

    const page = navPath.join('/');

    useEffect(() => { if (!user) navigate('/') }, [user, navigate]);

    return user !== null ? (
        <DashboardLayout>
            <SidebarToggle className='absolute hover:bg-neutral-500 p-1 bg-neutral-600 text-neutral-100
                rounded-md ml-4 z-0 left-0 top-3 bg-neutral-600'>
                <img src='/menu.svg' className='w-6 z-0' />
            </SidebarToggle>
            <div className='flex w-full h-full justify-center'>
                <div className='flex w-full'>
                    {
                        (
                            /^devices$/.test(page) || /^devices\/add$/.test(page)
                        ) && <DashboardDevices />
                    }
                    {
                        (
                            /^services$/.test(page) || /^services\/create$/.test(page) || /^services\/edit/.test(page)
                        ) && <DashboardServices />
                    }
                    {
                        (
                            /^communities$/.test(page) || /^communities\/create$/.test(page)
                        ) && <DashboardCommunities />
                    }
                </div>
            </div>
        </DashboardLayout>
    ) : <></>
}

export default Dashboard;
