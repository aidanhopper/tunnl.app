import React, { createContext, useState, useContext, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type DropdownState = {
    isExpanded: boolean,
    x: number;
    y: number;
}

const DropdownContext = createContext<{
    dropdownState: DropdownState, setDropdownState: (value: DropdownState) => void
} | null>(null);

const useDropdown = () => {
    const context = useContext(DropdownContext);
    if (!context) throw new Error('useDropdown must be used within a DropdownProvider');
    return context;
}

export const DropdownProvider = ({ children }: { children?: React.ReactNode }) => {
    const [dropdownState, setDropdownState] = useState<DropdownState>({
        isExpanded: false,
        x: 0,
        y: 0,
    });

    return (
        <DropdownContext.Provider value={{ dropdownState, setDropdownState }}>
            <span className='h-full w-full'>
                {children}
            </span>
        </DropdownContext.Provider>
    );
}

export const DropdownToggle = ({ children, hover = false }: { children?: React.ReactNode, hover?: boolean }) => {
    const { dropdownState, setDropdownState } = useDropdown();
    const ref = useRef<HTMLDivElement>(null)

    const toggleDropdown = () => {
        if (!ref.current) return;
        setDropdownState({
            isExpanded: !dropdownState.isExpanded,
            x: ref.current.offsetLeft + ref.current.offsetWidth,
            y: ref.current.offsetTop + ref.current.offsetHeight,
        });
        document.body.style.overflow = 'hidden';
    }

    return (
        <span
            onMouseEnter={() => { if (hover) toggleDropdown() }}
            onClick={() => toggleDropdown()}
            ref={ref}
            className='w-full h-full'>
            {children}
        </span>
    );
}

export const DropdownGroup = ({ children, className = '' }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={`flex items-center text-neutral-100 flex-col bg-neutral-800 overflow-auto rounded-md ${className}`}>
            {children}
        </div>
    );
}

export const DropdownAnchor = ({ children }: { children?: React.ReactNode }) => {
    const { dropdownState, setDropdownState } = useDropdown();
    return (
        <>
            {
                dropdownState.isExpanded &&
                <button className='absolute top-0 left-0 w-full h-full'
                    onClick={() => {
                        setDropdownState({
                            isExpanded: false,
                            x: dropdownState.x,
                            y: dropdownState.y,
                        });
                        document.body.style.overflow = '';
                    }} />
            }
            <span className='relative'>
                {children}
            </span>
        </>
    );
}

export const DropdownButton = ({ children, className = '', onClick }:
    { children?: React.ReactNode, className?: string, onClick?: () => void }) => {
    const { dropdownState, setDropdownState } = useDropdown();
    return (
        <button
            className={`flex justify-center items-center w-full text-sm px-4 py-2
                hover:bg-neutral-700 duration-150 cursor-pointer ${className}`}
            onClick={() => {
                if (onClick) onClick();
                setDropdownState({ isExpanded: false, x: 0, y: 0 });
                document.body.style.overflow = '';
            }}>
            {children}
        </button>
    );
}

export const DropdownLink = ({ children, to, className = '' }:
    { children?: React.ReactNode, to: string, className?: string }) => {
    const { dropdownState, setDropdownState } = useDropdown();
    return (
        <Link
            onClick={() => {
                setDropdownState({ isExpanded: false, x: 0, y: 0 })
                setDropdownState({ isExpanded: false, x: 0, y: 0 });
                document.body.style.overflow = '';
            }}
            className={`flex justify-center items-center w-full text-sm px-4 py-2
                hover:bg-neutral-700 duration-150 cursor-pointer ${className}`}
            to={to}>
            {children}
        </Link>
    );
}

export const Dropdown = ({ children, offsetX = 0, offsetY = 0, className = '' }:
    { children?: React.ReactNode, offsetX?: number, offsetY?: number, className?: string }) => {
    const { dropdownState, setDropdownState } = useDropdown();
    const dropdownRef = useRef<HTMLDivElement>(null);
    return (
        <AnimatePresence>
            {
                dropdownState.isExpanded &&
                <div className='absolute top-0 left-0 h-full w-full z-10'>
                    <motion.div
                        ref={dropdownRef}
                        initial={{ scale: 0.8, opacity: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.1, ease: 'circInOut' }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`absolute shadow-md overflow-hidden rounded-md ${className}`}
                        style={{
                            top: dropdownState.y + offsetY,
                            left: dropdownState.x + offsetX,
                        }}>
                        {children}
                    </motion.div>
                    <div
                        onClick={() => {
                            setDropdownState({
                                isExpanded: false,
                                x: dropdownState.x,
                                y: dropdownState.y,
                            });
                            document.body.style.overflow = '';
                        }}
                        className='z-40 w-full h-full top-0 left-0 select-none' />
                </div>
            }
        </AnimatePresence>
    );
}
