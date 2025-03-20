import React, { createContext, useState, useContext, Ref, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoredState } from '../hooks';

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
            {children}
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

export const PopupWindowHeader = ({ children, className = '' }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={`flex px-6 pt-6 pb-2 text-4xl font-bold ${className}`}>
            <h1>
                {children}
            </h1>
        </div>
    );
}

export const PopupWindowContainer = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => {
    const initialHeight = 600;

    const [maxHeight, setMaxHeight] = useState(initialHeight);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerHeight <= initialHeight + 20)
                setMaxHeight(window.innerHeight - 20);
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => { window.removeEventListener('resize', handleResize) }
    }, [])

    return (
        <div className={`max-w-[400px] flex flex-col bg-neutral-600
            text-neutral-100 rounded-lg border-4 border-neutral-200 shadow-xl ${className}`}
            style={{
                maxHeight: maxHeight,
            }}
        >
            {children}
        </div>
    );
}

export const PopupWindowBody = ({ children, className = '', disableScroll = false }:
    { children?: React.ReactNode, className?: string, disableScroll?: boolean }) => {
    return (
        <div className={`overflow-auto flex flex-col flex-1 px-6 py-1 ${className}`}
            style={disableScroll ? {
                scrollbarWidth: 'none',
                overflow: 'hidden',
            } : {
                scrollbarWidth: 'none',
            }}>
            {children}
        </div >
    );
}

export const PopupWindowFooter = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className={`flex pb-6 px-6 pt-2`}>
            {children}
        </div>
    );
}


export const PopupWindowForm = ({ children, onSubmit = async () => { } }:
    { children?: React.ReactNode, onSubmit?: (closeForm: () => void) => void }) => {
    const { isExpanded, setIsExpanded } = usePopupWindow();
    return (
        <form className='h-full w-full' onSubmit={async (e) => {
            e.preventDefault();
            onSubmit(() => setIsExpanded(false));
        }}>
            {children}
        </form>
    );
}

export const PopupWindowInput = ({
    title = '', description = '', placeholder = '',
    className = '', inputClassName = '', ref, focus = false,
    error = ''
}:
    {
        title?: string, description?: string, placeholder?: string, className?: string,
        inputClassName?: string, ref?: Ref<HTMLInputElement>, focus?: boolean,
        error?: string
    }) => {
    return (
        <div className='mb-6'>
            <label className={`overflow-hidden ${className}`}>
                {
                    title !== '' &&
                    <h1 className='mb-1 font-bold text-2xl'>
                        {title}
                    </h1>
                }
                <p className='mb-2 text-wrap'>
                    {
                        description
                    }
                </p>
                <input
                    autoFocus={focus}
                    placeholder={placeholder}
                    ref={ref}
                    className={`w-full text-neutral-600 bg-neutral-100 rounded-sm px-2 py-1 ${inputClassName}`} />
                {
                    error !== '' &&
                    <p className='my-2 text-wrap text-red-300'>
                        {error}
                    </p>
                }
            </label>
        </div>
    );
}

export const PopupWindowFormSubmit = ({ children }: { children?: React.ReactNode }) => {
    return (
        <button type='submit'>
            {children}
        </button>
    );
}

export const PopupWindowFormSubmitButton = ({ children, onSubmit = () => { }, className = '' }:
    { children?: React.ReactNode, onSubmit?: (closeForm: () => void) => void, className?: string }) => {
    const { isExpanded, setIsExpanded } = usePopupWindow();
    return (
        <button
            onClick={() => onSubmit(() => setIsExpanded(false))}
            className={`bg-neutral-200 text-neutral-600 rounded w-full p-1 text-lg
            hover:bg-neutral-300 cursor-pointer duration-150 ${className}`}
        >
            {children}
        </button>
    );
}

export const PopupWindow = ({ children, onClose = () => { } }:
    { children?: React.ReactNode, onClose?: () => void }) => {
    const { isExpanded, setIsExpanded } = usePopupWindow();
    const [isAlreadyExpanded, setIsAlreadyExpanded] = useStoredState('popup is open', false);

    useEffect(() => {
        setIsAlreadyExpanded(isExpanded);
        return () => { setIsAlreadyExpanded(false) }
    }, [setIsAlreadyExpanded, isExpanded]);

    return (
        <AnimatePresence
            initial={!isAlreadyExpanded}
            onExitComplete={() => { setIsAlreadyExpanded(false); onClose(); }}>
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

type PopupWindowSelectState = {
    isExpanded: boolean,
    width: number,
    buttonHeight: number,
    selectedValue?: string,
}

const PopupWindowSelectContext = createContext<{
    popupWindowSelectState: PopupWindowSelectState
    setPopupWindowSelectState: (value: PopupWindowSelectState) => void
} | null>(null);

const usePopupWindowSelect = () => {
    const context = useContext(PopupWindowSelectContext);
    if (!context) throw new Error('usePopupWindow must be used within a PopupWindowProvider');
    return context;
}

export const PopupWindowSelectProvider = ({ children, initial = false }: { children?: React.ReactNode, initial?: boolean }) => {
    const [popupWindowSelectState, setPopupWindowSelectState] = useState<PopupWindowSelectState>({
        isExpanded: initial,
        width: 0,
        buttonHeight: 0,
    });
    return (
        <PopupWindowSelectContext.Provider value={{ popupWindowSelectState, setPopupWindowSelectState }}>
            {children}
        </PopupWindowSelectContext.Provider>
    );
}

export const PopupWindowSelectToggle = ({ children, onClick = () => { } }:
    { children?: React.ReactNode, onClick?: () => void }) => {
    const { popupWindowSelectState, setPopupWindowSelectState } = usePopupWindowSelect();

    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!buttonRef.current) return;
        setPopupWindowSelectState({
            isExpanded: popupWindowSelectState.isExpanded,
            width: buttonRef.current.offsetWidth,
            buttonHeight: buttonRef.current.offsetHeight,
        })
    }, [setPopupWindowSelectState]);

    return (
        <button
            ref={buttonRef}
            onClick={() => {
                setPopupWindowSelectState({
                    isExpanded: true,
                    width: popupWindowSelectState.width,
                    buttonHeight: popupWindowSelectState.buttonHeight,
                });
                onClick();
            }}
            type='button'
            className='mt-3 mb-6 hover:bg-neutral-800 bg-neutral-700 duration-150
            font-bold w-full text-neutral-200 px-1 py-2 rounded-md cursor-pointer'>
            &nbsp; {children} &nbsp;
        </button>
    );
}

export const PopupWindowSelectOption = ({ value = '', onClick = () => { } }: { value?: string, onClick?: () => void }) => {
    const { popupWindowSelectState, setPopupWindowSelectState } = usePopupWindowSelect();
    return (
        <li>
            <button
                className='w-full py-2 bg-neutral-800 text-neutral-100 font-semibold hover:bg-neutral-900 duration-150
                cursor-pointer'
                type='button'
                onClick={() => {
                    onClick();
                    setPopupWindowSelectState({
                        isExpanded: popupWindowSelectState.isExpanded,
                        width: popupWindowSelectState.width,
                        buttonHeight: popupWindowSelectState.buttonHeight,
                        selectedValue: value.trim()
                    })
                }}>
                {value.trim()}
            </button>
        </li>
    );
}

export const PopupWindowSelect = ({ children, onClose = () => { }, onSubmit = () => { } }:
    { children?: React.ReactNode, onClose?: () => void, onSubmit?: ({ close, value }: { close: () => void, value: string }) => void }) => {
    const { popupWindowSelectState, setPopupWindowSelectState } = usePopupWindowSelect();
    const listRef = useRef<HTMLUListElement>(null);

    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (!listRef.current) return;
        setHeight(listRef.current.offsetHeight);
    }, [popupWindowSelectState.isExpanded, listRef.current?.offsetHeight]);

    useEffect(() => {
        if (!popupWindowSelectState.selectedValue) return;
        if (!popupWindowSelectState.isExpanded) return;
        onSubmit({
            value: popupWindowSelectState.selectedValue,
            close: () => {
                setPopupWindowSelectState({ ...popupWindowSelectState, selectedValue: undefined, isExpanded: false });
                onClose();
            },
        });
    }, [popupWindowSelectState.selectedValue, onSubmit, popupWindowSelectState, setPopupWindowSelectState, onClose]);
    return (
        <AnimatePresence>
            {
                popupWindowSelectState.isExpanded &&
                <>
                    <div
                        className='w-full h-full absolute top-0 left-0'
                        onClick={() => {
                            setPopupWindowSelectState({
                                isExpanded: false,
                                width: popupWindowSelectState.width,
                                buttonHeight: popupWindowSelectState.buttonHeight,
                            });
                        }} />
                    <motion.div className='relative w-full h-full'
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ duration: 0.1 }}
                    >
                        <div
                            className='absolute text-white overflow-auto'
                            style={{
                                left: 0,
                                top: -1 * popupWindowSelectState.buttonHeight * 1.6 - height - 5,
                            }}
                        >
                            <ul
                                ref={listRef}
                                style={{ width: popupWindowSelectState.width, scrollbarWidth: 'thin', colorScheme: 'dark' }}
                                className='flex flex-col justify-end max-h-[300px] rounded-md bg-neutral-800 
                                    overflow-auto [&>*:first-child]:rounded-t [&>*:last-child]:rounded-b shadow-xl'>
                                {children}
                            </ul>
                        </div>
                    </motion.div>
                </>
            }
        </AnimatePresence>
    );
}
