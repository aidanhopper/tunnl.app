export const DashboardPageHeader = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='font-bold text-5xl mb-4'>
            <h1 className='capitalize'>
                {children}
            </h1>
        </div>
    );
}

export const DashboardPage = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='flex flex-col w-full h-full'>
            {children}
        </div>
    );
}
