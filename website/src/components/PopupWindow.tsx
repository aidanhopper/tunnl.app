import React, { createContext, useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PopupWindowContext = createContext<{
    isExpanded: boolean, setIsExpanded: (value: boolean) => void
} | null>(null);

const usePopupWindow = () => {
    const context = useContext(PopupWindowContext);
    if (!context) throw new Error('usePopupWindow must be used within a PopupWindowProvider');
    return context;
}

export const PopupWindowProvider = ({ children, initial = false }: { children?: React.ReactNode, initial?: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(initial);
    return (
        <PopupWindowContext.Provider value={{ isExpanded, setIsExpanded }}>
            <span className='h-full w-full'>
                {children}
            </span>
        </PopupWindowContext.Provider>
    );
}

export const PopupWindowToggle = ({ children }: { children?: React.ReactNode }) => {
    const { isExpanded, setIsExpanded } = usePopupWindow();
    return (
        <span className='w-full h-full' onClick={() => setIsExpanded(!isExpanded)}>
            {children}
        </span>
    );
}

export const PopupWindowSubmit = ({ children }: { children?: React.ReactNode }) => {
    const { isExpanded, setIsExpanded } = usePopupWindow();
    return (
        <span onClick={() => setIsExpanded(false)}>
            {children}
        </span>
    );
}

export const PopupWindow = ({ children, onClose = () => { } }:
    { children?: React.ReactNode, onClose?: () => void }) => {
    const { isExpanded, setIsExpanded } = usePopupWindow();
    return (
        <AnimatePresence onExitComplete={() => onClose()}>
            {
                isExpanded &&
                <>
                    <motion.span
                        key={'bg'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className='absolute w-screen h-screen bg-neutral-900 left-0
                            top-0 pointer-events-none' />
                    <span className='top-0 left-0 absolute w-full h-full z-20 pointer-events-none
                            flex justify-center items-center'>
                        <motion.span className='pointer-events-auto'
                            key={'content'}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.1 }}
                        >
                            {children}
                        </motion.span>
                    </span>
                    <span className='absolute z-10 w-screen h-screen top-0
                            left-0 select-none pointer-events-auto'
                        onClick={() => {
                            setIsExpanded(false)
                        }} />
                </>
            }
        </AnimatePresence>
    );
}
