import {
    PopupWindowProvider, PopupWindowToggle, PopupWindow, PopupWindowFormSubmit,
    PopupWindowContainer, PopupWindowBody, PopupWindowForm, PopupWindowInput,
    PopupWindowSelect, PopupWindowSelectToggle, PopupWindowSelectOption,
    PopupWindowSelectProvider, PopupWindowHeader, PopupWindowFooter, PopupWindowSubmit
} from './PopupWindow';

const AreYouSure = ({ isOpen = false, onYes = () => { }, onClose = () => { }, title = 'Are you sure?' }:
    { isOpen?: boolean, title?: string, onClose?: () => void, onYes?: () => void }) => {
    return !isOpen ? <></> : (
        <PopupWindowProvider initial>
            <PopupWindow onClose={onClose}>
                <PopupWindowContainer>
                    <PopupWindowHeader className='text-lg text-center'>
                        {title}
                    </PopupWindowHeader>
                    <PopupWindowBody>
                        <div className='grid grid-cols-2 gap-1'>
                            <PopupWindowToggle>
                                <button
                                    className='px-4 py-1 w-full h-full text-center
                                    bg-neutral-700 rounded hover:bg-red-900 duration-150
                                    cursor-pointer'
                                    onClick={() => onYes()}
                                >
                                    Yes
                                </button>
                            </PopupWindowToggle>
                            <PopupWindowToggle>
                                <button
                                    className='px-4 py-1 w-full h-full text-center
                                    bg-neutral-700 rounded hover:bg-neutral-800 duration-150
                                    cursor-pointer'
                                >
                                    No
                                </button>
                            </PopupWindowToggle>
                        </div>
                    </PopupWindowBody>
                    <PopupWindowFooter />
                </PopupWindowContainer>
            </PopupWindow>
        </PopupWindowProvider>
    );
}

export default AreYouSure;
