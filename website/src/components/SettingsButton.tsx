import {
    DropdownToggle, DropdownProvider, Dropdown,
    DropdownGroup, DropdownLink, DropdownButton
} from './Dropdown';

const SettingsButton = () => {
    return (
        <div>
            <DropdownProvider>
                <DropdownToggle>
                    <div className='flex flex-col h-5 cursor-pointer w-3'>
                        <div className='flex-1'>
                            <div className='h-1 w-1 bg-neutral-600 rounded-full' />
                        </div>
                        <div className='flex-1'>
                            <div className='h-1 w-1 bg-neutral-600 rounded-full' />
                        </div>
                        <div className='flex-1'>
                            <div className='h-1 w-1 bg-neutral-600 rounded-full' />
                        </div>
                    </div>
                </DropdownToggle>
                <Dropdown>
                    <DropdownGroup>
                        <DropdownButton>
                            Remove service
                        </DropdownButton>
                    </DropdownGroup>
                </Dropdown>
            </DropdownProvider >
        </div>
    );
}

export default SettingsButton;
