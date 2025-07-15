import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Content from "@/components/content";
import { ReactNode } from "react";
import { ValidateUserSession } from "@/components/user-session";
import Topbar from "./topbar";
import { getLatestUpdateMessage, IGetLatestUpdateMessageResult } from "@/db/types/update_messages.queries";
import client from "@/lib/db";


const DashboardLayout = async ({ children }: { children?: ReactNode }) => {
    let message: IGetLatestUpdateMessageResult | null = null;
    const messageList = await getLatestUpdateMessage.run(undefined, client);
    if (messageList.length !== 0) message = messageList[0];
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <main>
                <Topbar message={<>
                    {message?.content}
                </>} />
                <Content className='py-4 mt-28'>
                    <ValidateUserSession>
                        {children}
                    </ValidateUserSession>
                </Content>
            </main>
        </SidebarProvider>
    )
}

export default DashboardLayout;
