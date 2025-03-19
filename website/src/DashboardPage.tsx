import { Link } from 'react-router-dom'

export const DashboardPageHeaderImage = ({ path, className = '' }:
    { path: string, className?: string }) => {
    return (
        <img src={path} className={`mt-1 w-10 mr-6 ${className}`} />
    );
}

export const DashboardPageHeader = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='font-bold text-5xl mb-4 h-16'>
            <div className='justify-center sm:justify-start flex items-center'>
                {children}
            </div>
        </div>
    );
}

export const DashboardPage = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='flex justify-center w-full'>
            <div className='max-w-[1300px] flex flex-col w-full h-full
                pt-16 lg:pt-6 px-6 lg:px-16 min-w-[400px]'>
                {children}
            </div>
        </div>
    );
}

export const DashboardPageDescription = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='flex mb-8 flex-col sm:flex-row'>
            {children}
        </div>
    );
}

export const DashboardPageDescriptionItem = ({ children, className = '' }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={`flex-1 flex items-center ${className}`}>
            {children}
        </div>
    );
}

export const DashboardPageDescriptionLink = ({ children, to }:
    { children?: React.ReactNode, to: string }) => {
    return (
        <div className='my-8 flex w-full sm:w-fit sm:my-0'>
            <Link
                to={to}
                className='rounded-md w-full text-center px-3 py-4 sm:py-2 bg-neutral-600 hover:bg-neutral-500
                                duration-150 cursor-pointer text-neutral-100'>
                {children}
            </Link>
        </div>
    );
}
