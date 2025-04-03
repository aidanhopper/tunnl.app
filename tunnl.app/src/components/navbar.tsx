'use client'

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { BadgeCheck, LogOut } from 'lucide-react';
import ThemeSwitcher from '@/components/theme-switcher';
import Content from '@/components/content';

const Navbar = () => {
    return (
        <nav className='w-full h-14 top-0 flex items-center bg-background/60 backdrop-blur-3xl sticky'>
            <Content className='grid grid-cols-2'>
                <div>
                    <span className='flex h-full font-mono items-center text-lg'>
                        tunnl.app
                    </span>
                </div>
                <div className='gap-4 flex h-full justify-end items-center'>
                    <ThemeSwitcher />
                    <Button
                        variant='ghost'
                        className='text-muted-foreground cursor-pointer'>
                        Pricing
                    </Button>
                    <Button
                        variant='ghost'
                        className='text-muted-foreground cursor-pointer'>
                        Download
                    </Button>
                    <Button
                        variant='ghost'
                        className='cursor-pointer text-muted-foreground'
                        asChild>
                        <Link href='/dashboard'>
                            Dashboard
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant='outline' className='cursor-pointer' asChild>
                                <Avatar className="h-9 w-9">
                                    <AvatarImage />
                                    <AvatarFallback className="rounded-lg">A</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuGroup>
                                <DropdownMenuItem className='cursor-pointer'>
                                    <BadgeCheck />
                                    Account
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className='cursor-pointer'>
                                <LogOut />
                                Log Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </Content>
        </nav>
    );
}

export default Navbar;