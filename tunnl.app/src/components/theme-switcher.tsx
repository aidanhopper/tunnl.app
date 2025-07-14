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

    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            className='p-2 cursor-pointer select-none'
                            size='icon'
                            variant='ghost'
                            onClick={handleTheme}
                            asChild
                        >
                            {
                                isMounted ?
                                    (theme === 'dark' ?
                                        <Moon />
                                        : <Sun />) : <Moon />
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
