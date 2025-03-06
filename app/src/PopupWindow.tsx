import { motion, AnimatePresence } from 'framer-motion';
import { useState, Ref } from 'react';

export const PopupWindowInput = ({ label, placeholder, className, description, ref }:
    {
        label?: string, placeholder: string, className?: string,
        description?: string, ref: Ref<HTMLInputElement>
    }) => {
    return (
        <div className={className}>
            <label>
                <div className="pt-1 pb-3 rounded-lg">
                    <h2 className="text-lg">
                        {label}
                    </h2>
                    <p className="pb-2 text-sm">
                        {description}
                    </p>
                    <input
                        className={`w-full py-1 px-2 text-lg bg-neutral-200 text-neutral-800 rounded
                            focus:border-blue-300 border-transparent border-2`}
                        placeholder={placeholder}
                        ref={ref}
                    />
                </div>
            </label>
        </div >
    )
}

export const PopupWindow = ({ children, className, onClickOff }:
    { children?: React.ReactNode, className?: string, onClickOff?: () => void, onSubmit?: () => void }) => {

    const [clickedOff, setClickedOff] = useState(false);

    return (
        <motion.div className={`left-0 top-0 absolute w-screen h-screen`}
            exit={{opacity: 0}}
            >
            <AnimatePresence onExitComplete={onClickOff}>
                {
                    clickedOff ? null :
                        <>
                            <motion.button className="bg-neutral-900 w-screen h-screen absolute left-0 top-0"
                                onClick={() => { if (onClickOff) setClickedOff(true) }}
                                transition={{ duration: 0.1 }}
                                exit={{ opacity: 0 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }} />
                            <div className="w-screen h-screen flex justify-center
                                items-center absolute pointer-events-none">
                                <motion.div className={`relative pointer-events-auto ${className}`}
                                    transition={{ duration: 0.2 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}>
                                    {children}
                                </motion.div>
                            </div>
                        </>
                }
            </AnimatePresence>
        </motion.div>
    );
}
