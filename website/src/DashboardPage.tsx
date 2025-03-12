export const DashboardPageHeader = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='font-bold text-5xl mb-4'>
            <div className='capitalize flex items-center'>
                {children}
            </div>
        </div>
    );
}

export const DashboardPage = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='flex justify-center w-full overflow-hidden'>
            <div className='max-w-[1300px] flex flex-col w-full h-full overflow-y-scroll
                pt-16 lg:pt-6 px-2 lg:px-16 overflow-x-hidden min-w-[500px]'>
                {children}
            </div>
        </div>
    );
}
