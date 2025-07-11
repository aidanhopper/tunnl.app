'use client'

import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import ThemeSwitcher from "@/components/theme-switcher";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Content from "@/components/content";
import { ReactNode } from "react";
import DashboardBreadcrumb from "./dashboard-breadcrumb";
import { ValidateUserSession } from "@/components/user-session";

const DashboardLayout = ({ children }: { children?: ReactNode }) => {
    return (
        <ValidateUserSession>
            <SidebarProvider>
                <DashboardSidebar />
                <main>
                    <div className='flex px-4 h-[65px] items-center'>
                        <div className='flex w-full flex-1 items-center gap-8'>
                            <SidebarTrigger />
                            <DashboardBreadcrumb />
                        </div>
                        <div className='flex flex-0 justify-end items-center'>
                            <ThemeSwitcher />
                        </div>
                    </div>
                    <hr className='border-sidebar-border' />
                    <Content className='py-4'>
                        {children}
                    </Content>
                </main>
            </SidebarProvider>
        </ValidateUserSession>
    )
}

export default DashboardLayout;
