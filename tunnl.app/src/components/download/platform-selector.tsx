'use client'

import { Button } from "../ui/button";
import { usePlatform } from "./platform-provider";

type Platform = 'iOS' | 'MacOS' | 'Android' | 'Windows' | 'Linux' | 'Docker';

const platformList: Platform[] = [
    'iOS',
    'MacOS',
    'Windows',
    'Android',
    'Linux',
    'Docker',
];

const PlatformSelector = () => {
    const { platform, setPlatform } = usePlatform();
    return (
        <>
            {platformList.map(e => {
                return (
                    <Button
                        onClick={() => setPlatform(e)}
                        key={e}
                        variant={platform === e ? 'default' : 'secondary'}
                        className='cursor-pointer p-0 m-0 w-20 h-20 lg:h-36 lg:w-36 flex 
                                    items-center justify-center lg:text-2xl font-bold'>
                        {e}
                    </Button>
                );
            })}
        </>
    );
}

export default PlatformSelector;
