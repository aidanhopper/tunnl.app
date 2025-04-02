import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import ThemeSwitcher from "@/components/theme-switcher";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Content from "@/components/content";
import { ReactNode } from "react";

const DashboardLayout = ({ children }: { children?: ReactNode }) => {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main>
                <div className='grid grid-cols-2 py-2 px-4 h-12'>
                    <SidebarTrigger />
                    <div className='w-full flex justify-end'>
                        <ThemeSwitcher />
                    </div>
                </div>
                <Content>
                    {children}
                </Content>
            </main>
        </SidebarProvider>

    )
}

export default DashboardLayout;