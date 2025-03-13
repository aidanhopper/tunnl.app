import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStoredState } from '../hooks';
import { createContext, useContext } from 'react';
import { Link } from 'react-router-dom';

const SidebarContext = createContext<{
    isExpanded: boolean, setIsExpanded: (value: boolean) => void
} | null>(null);

const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error('useSidebar must be used within a SidebarProvider');
    return context;
}

export const SidebarProvider = ({ children }: { children?: React.ReactNode }) => {
    const [isExpanded, setIsExpanded] = useStoredState('sidebar is expanded', true);
    return (
        <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
            <div className="flex w-full h-full">
                {children}
            </div>
        </SidebarContext.Provider>
    );
}

export const SidebarToggle = ({ children, className }:
    { children?: React.ReactNode, className?: string }) => {
    const { isExpanded, setIsExpanded } = useSidebar();
    return (
        <button className={`duration-150 cursor-pointer ${className}`}
            onClick={() => {
                setIsExpanded(!isExpanded)
            }}>
            {children}
        </button>
    );
}

export const SidebarBody = ({ children, className }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={`flex-1 ${className}`}>
            {children}
        </div>
    );
}

export const SidebarFooter = ({ children, className }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
}

export const SidebarHeader = ({ children, className }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    );
}

export const SidebarButton = ({ children, className = '', onClick = () => { }, imgPath, active = false }:
    { children?: React.ReactNode, className?: string, onClick?: () => void, imgPath?: string, active?: boolean }) => {
    return (
        <button className={`text-lg hover:bg-neutral-500 rounded-md duration-150 overflow-x-hidden
            w-full cursor-pointer mb-4 ${active ? 'bg-neutral-500' : 'bg-neutral-600'} ${className}`}
            onClick={() => onClick()}>
            <div className='flex justify-start items-center px-4 py-1 whitespace-nowrap'>
                {
                    imgPath &&
                    <img className='w-5 mr-4' src={imgPath} />
                }
                <>
                    {children}
                </>
            </div>
        </button>
    );
}

export const SidebarLink = ({ children, className = '', to, imgPath, active = false, onClick = (_) => { } }:
    {
        children?: React.ReactNode, className?: string, to: string, imgPath?: string, active?: boolean,
        onClick?: (setIsExpanded: (newValue: boolean) => void) => void
    }) => {
    const { isExpanded, setIsExpanded } = useSidebar();
    return (
        <Link to={to} onClick={() => onClick(setIsExpanded)}>
            <div className={`text-lg hover:bg-neutral-500 rounded-md duration-150 overflow-x-hidden
            w-full cursor-pointer mb-4 ${active ? 'bg-neutral-500' : 'bg-neutral-600'} ${className}`}>
                <div className='flex justify-start items-center px-4 py-1 whitespace-nowrap'>
                    {
                        imgPath &&
                        <img className='w-5 mr-4' src={imgPath} />
                    }
                    {children}
                </div>
            </div>
        </Link>
    );
}

export const Sidebar = ({ children, className, expandedWidth, contractedWidth, onExpand, onContract }:
    {
        children?: React.ReactNode, className?: string,
        expandedWidth: number, contractedWidth: number
        onExpand?: () => void, onContract?: () => void
    }) => {
    const sidebarRef = useRef<HTMLDivElement>(null)
    const { isExpanded, setIsExpanded } = useSidebar();

    useLayoutEffect(() => {
        if (onExpand && isExpanded) onExpand();
        else if (onContract && !isExpanded) onContract();
    }, [isExpanded, onContract, onExpand]);

    return (
        <AnimatePresence initial={false}>
            <motion.div
                ref={sidebarRef}
                animate={{
                    width: isExpanded ? expandedWidth : contractedWidth,
                }}
                transition={{ duration: 0.3, ease: 'circInOut' }}
                exit={{ width: 0 }}
                className={`h-full flex shrink-0 flex-col overflow-x-hidden ${className}`}>
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
