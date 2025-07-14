'use client'

import { Button } from "./ui/button";

const JoinShareButton = ({ onClick }: { onClick: () => Promise<void> }) => {
    return (
        <Button
            onClick={onClick}
            className='w-full cursor-pointer'>
            Accept
        </Button>
    )
}

export default JoinShareButton;
