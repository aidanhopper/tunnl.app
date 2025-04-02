'use client'

import '@/app/globals.css'

import { Button } from '@/components/ui/button';

import Link from 'next/link';

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
    ChevronsRight,
} from 'lucide-react';

const items = [
    {
        title: 'Home',
        url: '/dashboard',
        icon: Home,
    },
    {
        title: 'Communities',
        url: '/dashboard/communities',
        icon: Users,
    },
    {
        title: 'Services',
        url: '/dashboard/services',
        icon: HelpingHand,
    },
    {
        title: 'Devices',
        url: '/dashboard/devices',
        icon: MonitorSmartphone,
    },
];

const DashboardSidebar = ({ ...props }) => {
    const { isMobile } = useSidebar();
    return (
        <Sidebar {...props}>
            <SidebarHeader>
                <div className='flex justify-left items-center h-12'>
                    <Button variant='ghost' className='text-xl font-mono font-bold' asChild>
                        <Link href='/'>
                            <ChevronsRight style={{ scale: 1.5 }} />
                            tunnl.app
                        </Link>
                    </Button>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
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
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage />
                                        <AvatarFallback className="rounded-lg">A</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">Aidan</span>
                                        <span className="truncate text-xs">aidanhop1@gmail.com</span>
                                    </div>
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
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage />
                                            <AvatarFallback className="rounded-lg">A</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">Aidan</span>
                                            <span className="truncate text-xs">aidanhop1@gmail.com</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem className='cursor-pointer'>
                                        <BadgeCheck />
                                        Account
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='cursor-pointer'>
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