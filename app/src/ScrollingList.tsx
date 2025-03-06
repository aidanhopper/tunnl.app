import SidebarButton from './SidebarButton';
import deviceID from './deviceid';
import { useState, useEffect, useRef, Ref } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollingListDropdownTrigger = ({ visible, onClick, ref }:
    { visible?: boolean, onClick?: () => void, ref: Ref<HTMLButtonElement> }) => {
    return (
        <button
            ref={ref}
            onClick={() => { if (onClick) onClick() }}
            className={`text-3xl invisible p-1 cursor-pointer ${visible ? "" : "group-hover:visible"}`}>
            <div className="w-[4px] mb-[2px] h-[4px] rounded-full bg-black" />
            <div className="w-[4px] mb-[2px] h-[4px] rounded-full bg-black" />
            <div className="w-[4px] h-[4px] rounded-full bg-black" />
        </button>
    );
}

const ScrollingListDropdownButton = ({ children, className, onClick }:
    { children?: React.ReactNode, className?: string, onClick?: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`hover:bg-neutral-800 w-full hover:text-neutral-200
                rounded duration-100 ${className}`}>
            <li className="flex justify-center items-center py-1">
                {children}
            </li>
        </button>
    );
}

const ScrollingListDropdown = ({ isExpanded, onClickOff, children, position }:
    {
        isExpanded: boolean, onClickOff?: () => void, children?: React.ReactNode,
        position: { x: number, y: number }
    }) => {
    const posRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className="w-full">
                <div className="w-full" ref={posRef}>
                    <AnimatePresence>
                        {
                            position &&
                            isExpanded &&
                            <motion.ul
                                style={{ left: position.x, top: position.y }}
                                initial={{ opacity: 0, scale: 0, translateY: -15 }}
                                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                                transition={{ duration: 0.1 }}
                                exit={{ opacity: 0, scale: 0, translateY: -15 }}
                                className={`absolute z-10 overflow-auto w-32 text-neutral-900
                                    shadow-xl bg-neutral-200 rounded border-2 border-neutral-200`}>
                                {children}
                            </motion.ul>
                        }
                    </AnimatePresence>
                </div>
            </div>
            <AnimatePresence>
                {
                    isExpanded &&
                    <motion.button
                        className="absolute h-screen w-screen top-0 right-0 opacity-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.05 }}
                        exit={{ opacity: 0 }}
                        onClick={() => { if (onClickOff) onClickOff() }} />
                }
            </AnimatePresence>
        </>
    );
}

const ScrollingListButton = ({ id, to, active, children, dropdownOptions }:
    {
        id: string, to: string, active: boolean, children?: React.ReactNode,
        dropdownOptions?: { content: React.ReactNode, onClick: () => void, className?: string }[]
    }) => {
    const [device, setDevice] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<{ x: number, y: number }>();
    const dropdownButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        deviceID().then(i => setDevice(i));
    }, [])

    useEffect(() => {
        if (dropdownButtonRef.current) {
            const rect = dropdownButtonRef.current.getBoundingClientRect();
            setDropdownPosition({
                x: rect.x + 10,
                y: rect.y + 15,
            });
        }
    }, [dropdownButtonRef.current])

    return (
        <>
            <SidebarButton to={to} active={active}>
                <div className="flex w-full min-h-6">
                    <div className="flex flex-1 justify-start items-center text-sm w-full">
                        {children}
                    </div>
                    <div className="flex justify-end items-center ml-1">
                        {
                            dropdownOptions &&
                            <ScrollingListDropdownTrigger
                                ref={dropdownButtonRef}
                                onClick={() => setIsExpanded(!isExpanded)}
                                visible={device === null || device === id} />
                        }
                    </div>
                </div>
            </SidebarButton>
            {
                dropdownPosition &&
                <ScrollingListDropdown
                    position={dropdownPosition}
                    isExpanded={isExpanded}
                    onClickOff={() => setIsExpanded(false)}>
                    {
                        dropdownOptions &&
                        dropdownOptions.map((o, i) => {
                            return (
                                <ScrollingListDropdownButton
                                    onClick={() => { o.onClick(); setIsExpanded(false); }}
                                    className={o.className}
                                    key={i}>
                                    {o.content}
                                </ScrollingListDropdownButton>
                            );
                        })
                    }
                </ScrollingListDropdown>
            }
        </>
    );
}

type DropdownOption = {
    content: React.ReactNode,
    onClick: () => void,
    className?: string,
}

type ListItem = {
    to: string,
    content: string,
    activeID: string,
    id: string,
    dropdownOptions?: DropdownOption[]
};

const ScrollingList = ({ listItems, activeItemId }: { listItems: ListItem[], activeItemId: string }) => {
    return (
        <div className="flex flex-1 flex-col overflow-y-scroll h-full mt-4">
            {
                listItems.map((item, i) => {
                    return (
                        <ScrollingListButton
                            dropdownOptions={item.dropdownOptions}
                            id={item.id}
                            to={item.to}
                            active={activeItemId === item.activeID}
                            key={i}>
                            {item.content}
                        </ScrollingListButton>
                    );
                })
            }
        </div>
    );
}

export default ScrollingList;
