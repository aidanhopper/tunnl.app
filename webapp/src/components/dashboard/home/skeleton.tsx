'use client'

import { Skeleton } from "@/components/ui/skeleton";

const HomeSkeleton = () => {
    return (
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 justify-center'>
            <span className='flex flex-col gap-4'>
                <Skeleton className='w-full h-32' />
                <Skeleton className='w-full h-8' />
            </span>
            <span className='flex flex-col gap-4 row-span-2'>
                <Skeleton className='w-full h-96' />
            </span>
            <span className='flex flex-col gap-4'>
                <Skeleton className='w-full h-72' />
            </span>
        </div>
    );
}

export default HomeSkeleton;
