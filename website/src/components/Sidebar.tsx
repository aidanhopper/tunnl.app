import React, { useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStoredState } from '../hooks';
import { createContext, useContext } from 'react';

const SidebarContext = createContext<{
    isExpanded: boolean, setIsExpanded: (value: boolean) => void
} | null>(null);

const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error('useSidebar must be used within a SidebarProvider');
    return context;
}

export const SidebarProvider = ({ children }: { children?: React.ReactNode }) => {
    const [isExpanded, setIsExpanded] = useStoredState('sidebarIsExpaned', true);
    return (
        <SidebarContext.Provider value={{ isExpanded, setIsExpanded }}>
            <div className="flex">
                {children}
            </div>
        </SidebarContext.Provider>
    );
}

export const SidebarToggle = ({ children, className }:
    { children?: React.ReactNode, className?: string }) => {
    const { isExpanded, setIsExpanded } = useSidebar();
    return (
        <button className={`${className}`}
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

export const Sidebar = ({ children, className, expandedWidth, contractedWidth, onExpand, onContract }:
    {
        children?: React.ReactNode, className?: string,
        expandedWidth: number, contractedWidth: number
        onExpand?: () => void, onContract?: () => void
    }) => {
    const sidebarRef = useRef<HTMLDivElement>(null)
    const { isExpanded, setIsExpanded } = useSidebar();

    useEffect(() => {
        if (onExpand && isExpanded) onExpand();
        else if (onContract && !isExpanded) onContract();
    }, [isExpanded, onContract, onExpand]);

    return (
        <AnimatePresence initial={false}>
            <motion.div
                ref={sidebarRef}
                animate={{ width: isExpanded ? expandedWidth : contractedWidth }}
                transition={{ duration: 0.3, ease: 'circInOut' }}
                exit={{ width: 0 }}
                className={`h-full flex flex-col overflow-x-hidden ${className}`}>
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
