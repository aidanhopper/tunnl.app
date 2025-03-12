export const Table = ({ children }: { children?: React.ReactNode }) => {
    return (
        <table className='text-left text-neutral-600 w-full'>
            {children}
        </table>
    )
}

export const TableHeader = ({ children }: { children?: React.ReactNode }) => {
    return (
        <>
            <thead className=''>
                <tr className=''>
                    {children}
                </tr>
            </thead>
        </>
    );
}

export const TableHead = ({ children, className = '' }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <th className='md:text-xl pb-2 px-2 border-b-[0.5px] border-neutral-400 relative'>
            {children}
        </th>
    );
}

export const TableData = ({ children, className = '' }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <td className={`px-2 border-b-[0.5px] border-neutral-400 py-6 ${className}`}>
            {children}
        </td >
    );
}

export const TableBody = ({ children }: { children?: React.ReactNode }) => {
    return (
        <tbody>
            {children}
        </tbody>
    );
}

export const TableRow = ({ children }:
    { children?: React.ReactNode }) => {
    return (
        <tr className='hover:bg-neutral-300 duration-150 text-sm md:text-base'>
            {children}
        </tr>
    );
}
