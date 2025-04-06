'use client'

import '@/app/globals.css'
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ThemeSwitcher = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

    return !isMounted ? null : (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className='p-2 cursor-pointer select-none'
                            variant='outline'
                            size='icon'
                            onClick={handleTheme}
                            asChild
                        >
                            {
                                theme === 'dark' ?
                                    <Moon />
                                    : <Sun />
                            }
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Switch the theme
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

        </div>
    );
}

export default ThemeSwitcher;
