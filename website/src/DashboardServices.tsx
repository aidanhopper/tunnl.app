import { DashboardPage, DashboardPageHeader } from './DashboardPage';

const DashboardServices = () => {
    return (
        <DashboardPage>
            <DashboardPageHeader>
                <img src='/services-dark.svg' className='mt-1 w-12 mr-4' />
                <h1>
                    Services
                </h1>
            </DashboardPageHeader>
            <div className='flex mb-8'>
                <div className='flex-1 flex items-center'>
                    <p>
                        Manage and create services that you can share.
                    </p>
                </div>
                <div className='flex-1 flex justify-end'>
                    <div>
                        <button className='rounded-md px-2 py-1 bg-neutral-600 hover:bg-neutral-500
                        duration-150 cursor-pointer text-neutral-100 whitespace-nowrap'>
                            Create a service
                        </button>
                    </div>
                </div>
            </div>
            <div>
                asdf
            </div>
        </DashboardPage>
    );
}

export default DashboardServices;
