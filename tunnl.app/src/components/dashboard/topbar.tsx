'use client'

import { ReactNode, useEffect, useState } from "react";
import ThemeSwitcher from "../theme-switcher";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import DashboardBreadcrumb from "./dashboard-breadcrumb";

const Topbar = ({ message = <>&nbsp;</> }: { message?: ReactNode }) => {
    const bar = useSidebar();
    const [topbarWidth, setTopbarWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        const handleResize = () =>
            setTopbarWidth(bar.isMobile ? window.innerWidth : bar.open ? window.innerWidth - 255 : window.innerWidth)
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); }
    }, [bar.isMobile, bar.open]);

    return (
        <div className='z-10 bg-accent/60 backdrop-blur-3xl fixed'>
            <div className='flex justify-center items-center p-1 font-mono text-center text-sm border-b'>
                {message}
            </div>
            <div
                style={{ width: topbarWidth ?? `calc(100vw - 255px)` }}
                className={`flex px-4 h-[66px] items-center 
                border-b overflow-x-hidden`}>
                <div className='flex w-full flex-1 items-center gap-8'>
                    <SidebarTrigger />
                    <DashboardBreadcrumb />
                </div>
                <div className='flex flex-0 justify-end items-center'>
                    <ThemeSwitcher />
                </div>
            </div>
        </div>
    );
}

export default Topbar;
