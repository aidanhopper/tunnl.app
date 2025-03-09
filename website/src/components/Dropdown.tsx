import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type DropdownState = {
    isExpanded: boolean,
    x: number;
    y: number;
}

export const DropdownContext = createContext<{
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
            <div className="flex">
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

export const DropdownToggle = ({ children }: { children?: React.ReactNode }) => {
    const { dropdownState, setDropdownState } = useDropdown();
    const ref = useRef<HTMLSpanElement>(null)
    return (
        <span
            ref={ref}
            className='w-full h-full'
            onClick={() => {
                if (!ref.current) return;
                const boundingBox = ref.current.getBoundingClientRect();
                setDropdownState({
                    isExpanded: !dropdownState.isExpanded,
                    x: boundingBox.x,
                    y: ref.current.scrollTop
                });
            }}>
            {children}
        </span >
    );
}

export const Dropdown = ({ children, offsetX, offsetY }:
    { children?: React.ReactNode, offsetX?: number, offsetY?: number }) => {
    const { dropdownState, setDropdownState } = useDropdown();
    return (
        <AnimatePresence>
            {
                dropdownState.isExpanded &&
                <div className='absolute top-0 left-0 h-screen w-screen'>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.1, ease: 'circInOut' }}
                        animate={{ scale: 1, opacity: 1 }}
                        className='absolute z-10'
                        style={{
                            top: offsetY ? dropdownState.y + offsetY : dropdownState.y,
                            left: offsetX ? dropdownState.x + offsetX : dropdownState.x,
                        }}>
                        {children}
                    </motion.div>
                    <div
                        onClick={() => {
                            setDropdownState({
                                isExpanded: false,
                                x: dropdownState.x,
                                y: dropdownState.y,
                            })
                        }}
                        className='w-full h-full top-0 left-0 select-none' />
                </div>
            }
        </AnimatePresence>
    );
}
