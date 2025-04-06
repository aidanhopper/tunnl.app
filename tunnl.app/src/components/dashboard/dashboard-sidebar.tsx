'use client'

import '@/app/globals.css'
import { Button } from '@/components/ui/button';
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
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
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
    BadgeCheck,
    ChevronsUpDown,
    LogOut,
    Settings,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useLocalSession, clearLocalSession } from '@/lib/hooks';

const items = [
    {
        title: 'Home',
        url: '/dashboard',
        icon: Home,
        subItems: []
    },
    {
        title: 'Communities',
        url: '/dashboard/communities',
        icon: Users,
        subItems: [
            {
                title: 'Create a community',
                url: '/dashboard/communities/create',
            },
            {
                title: 'Join a community',
                url: '/dashboard/communities/join',
            },
        ]
    },
    {
        title: 'Services',
        url: '/dashboard/services',
        icon: HelpingHand,
        subItems: [
            {
                title: 'Create a service',
                url: '/dashboard/services/create',
            }
        ]
    },
    {
        title: 'Devices',
        url: '/dashboard/devices',
        icon: MonitorSmartphone,
        subItems: [
            {
                title: 'Add a device',
                url: '/dashboard/devices/add',
            }
        ]
    },
];

const DashboardSidebar = ({ ...props }) => {
    const router = useRouter();
    const { data } = useLocalSession();
    const { isMobile } = useSidebar();
    const pathname = usePathname();

    const UserPanel = () => data?.user ? (
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={data.user.image ? data.user.image : ''} />
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
            <SidebarHeader className='py-0'>
                <div className='flex justify-center items-center h-16'>
                    <Button variant='ghost' className='text-xl font-mono font-bold' asChild>
                        <Link href='/'>
                            tunnl.app
                        </Link>
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    <SidebarMenuSub>
                                        {item.subItems.map(subItem => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                                    <Link href={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href='/dashboard/settings'>
                                        <Settings />
                                        <span>Settings</span>
                                    </Link>
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
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className='cursor-pointer'>
                                        <BadgeCheck />
                                        Account
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
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
        </Sidebar>
    );
}

export default DashboardSidebar;
