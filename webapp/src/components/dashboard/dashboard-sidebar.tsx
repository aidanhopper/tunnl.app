'use client'

import '@/app/globals.css'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Home,
    Users,
    HelpingHand,
    MonitorSmartphone,
    ChevronsUpDown,
    LogOut,
    ShieldUser,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useLocalSession, clearLocalSession, useCachedImage } from '@/lib/hooks';

const DashboardSidebar = ({ isAdmin, ...props }: { isAdmin: boolean }) => {
    const router = useRouter();
    const { data } = useLocalSession();
    const { isMobile } = useSidebar();
    const pathname = usePathname();
    const cachedAvatar = useCachedImage(data?.user?.image);

    const items = [
        {
            title: 'Home',
            url: '/dashboard',
            icon: Home,
            subItems: []
        },
        {
            title: 'Shares',
            url: '/dashboard/shares',
            icon: Users,
            subItems: []
        },
        {
            title: 'Services',
            url: '/dashboard/services',
            icon: HelpingHand,
            subItems: []
        },
        {
            title: 'Identities',
            url: '/dashboard/identities',
            icon: MonitorSmartphone,
            subItems: []
        },
    ];

    if (isAdmin) items.push({
        title: 'Admin',
        url: '/dashboard/admin',
        icon: ShieldUser,
        subItems: []
    });

    const UserPanel = () => data?.user ? (
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={cachedAvatar ?? ''} />
                <AvatarFallback className="rounded-lg">
                    {data.user.name ? data.user.name[0] : null}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{data.user.name}</span>
                <span className="truncate text-xs">{data.user.email}</span>
            </div>
        </div>
    ) : <></>;

    return (
        <Sidebar {...props}>
            <SidebarContent>
                <SidebarHeader className='font-bold font-mono text-left text-2xl p-0 m-0 w-full bg-accent/60'>
                    <div className='h-[66px] flex items-center justify-center border-b w-full pr-10'>
                        <Link href='/'>
                            🚂 tunnl.app
                        </Link>
                    </div>
                </SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            {item.icon ? <item.icon /> : null}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    {/* <Link href='/dashboard/settings'> */}
                                    {/*     <Settings /> */}
                                    {/*     <span>Settings</span> */}
                                    {/* </Link> */}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <DropdownMenu>
                            <DropdownMenuTrigger className='cursor-pointer' asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <UserPanel />
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <UserPanel />
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {/* <DropdownMenuGroup> */}
                                {/*     <DropdownMenuItem className='cursor-pointer'> */}
                                {/*         <BadgeCheck /> */}
                                {/*         Account */}
                                {/*     </DropdownMenuItem> */}
                                {/* </DropdownMenuGroup> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        signOut({ redirect: false });
                                        clearLocalSession();
                                        router.push('/');
                                    }}
                                    className='cursor-pointer'
                                >
                                    <LogOut />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar >
    );
}

export default DashboardSidebar;
