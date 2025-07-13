'use client'

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import ThemeSwitcher from "@/components/theme-switcher";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Content from "@/components/content";
import { ReactNode, useEffect, useState } from "react";
import DashboardBreadcrumb from "./dashboard-breadcrumb";
import { ValidateUserSession } from "@/components/user-session";

const Topbar = () => {
    const bar = useSidebar();
    const f = () => bar.isMobile ? window.innerWidth : bar.open ? window.innerWidth - 255 : window.innerWidth;
    const [topbarWidth, setTopbarWidth] = useState(f());

    useEffect(() => {
        const handleResize = () =>
            setTopbarWidth(bar.isMobile ? window.innerWidth : bar.open ? window.innerWidth - 255 : window.innerWidth)
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); }
    }, [bar.isMobile, bar.open]);

    return (
        <div
            style={{ width: topbarWidth }}
            className='z-10 flex px-4 h-[66px] items-center fixed bg-background/60 backdrop-blur-3xl border-b overflow-x-hidden'>
            <div className='flex w-full flex-1 items-center gap-8'>
                <SidebarTrigger />
                <DashboardBreadcrumb />
            </div>
            <div className='flex flex-0 justify-end items-center'>
                <ThemeSwitcher />
            </div>
        </div>
    );
}

const DashboardLayout = ({ children }: { children?: ReactNode }) => {
    return (
        <ValidateUserSession>
            <SidebarProvider>
                <DashboardSidebar />
                <main>
                    <Topbar />
                    <Content className='py-4 mt-20'>
                        {children}
                    </Content>
                </main>
            </SidebarProvider>
        </ValidateUserSession>
    )
}

export default DashboardLayout;
