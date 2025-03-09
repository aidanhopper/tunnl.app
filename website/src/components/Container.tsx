const Container = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className='w-full flex justify-center'>
            <div className='w-full max-w-[1400px]'>
                {children}
            </div>
        </div>
    );
}

export default Container;
