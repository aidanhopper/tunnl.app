const Container = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='w-full px-4 md:px-8 h-full flex justify-center'>
            <div className='w-full h-full max-w-[1400px]'>
                {children}
            </div>
        </div>
    );
}

export default Container;
