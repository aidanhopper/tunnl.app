import { createContext, useContext, useEffect, useState } from 'react'

type TableState = {
    isExpanded: boolean
}

const TableContext = createContext<{
    tableState: TableState, setTableState:
    (value: TableState) => void
} | null>(null)

const useTable = () => {
    const context = useContext(TableContext);
    if (!context) throw new Error('useTable must be used within a TableProvider');
    return context;
}

export const TableProvider = ({ children }: { children?: React.ReactNode }) => {
    const [tableState, setTableState] = useState<TableState>({
        isExpanded: true,
    });
    return (
        <TableContext.Provider value={{ tableState, setTableState }}>
            {children}
        </TableContext.Provider>
    );
}

export const Table = ({ children }: { children?: React.ReactNode }) => {
    const { tableState, setTableState } = useTable();

    useEffect(() => {
        const handleResize = () => setTableState({ ...tableState, isExpanded: window.innerWidth > 768 });
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize) }
    }, []);

    return tableState.isExpanded ? (
        <div>
            <table className='text-left text-neutral-600 w-full'>
                {children}
            </table>
        </div>
    ) : (
        <div className='flex flex-row h-96 overflow-x-auto'>
            {children}
        </div>
    );
}

export const TableHeader = ({ children }: { children?: React.ReactNode }) => {
    const { tableState, setTableState } = useTable();
    return tableState.isExpanded ? (
        <thead className=''>
            <tr>
                {children}
            </tr>
        </thead>
    ) : (
        <div className='pr-6  border-t-[1px] border-neutral-400 flex flex-col pt-2'>
            {children}
        </div>
    );
}

export const TableHead = ({ children, className = '' }:
    { children?: React.ReactNode, className?: string }) => {
    const { tableState, setTableState } = useTable();
    return tableState.isExpanded ? (
        <th className='md:text-xl pb-2 px-2 border-b-[0.5px] border-neutral-400 relative'>
            {children}
        </th>
    ) : (
        <div className='font-bold text-xl flex-1 flex items-center'>
            {children}
        </div>
    );
}

export const TableData = ({ children, className = '' }:
    { children?: React.ReactNode, className?: string }) => {
    const { tableState, setTableState } = useTable();
    return tableState.isExpanded ? (
        <td className={`px-2 border-b-[0.5px] border-neutral-400 py-2 ${className}`}>
            {children}
        </td >
    ) : (
        <div className='pl-2 flex-1 flex items-center'>
            {children}
        </div>
    );
}

export const TableBody = ({ children }: { children?: React.ReactNode }) => {
    const { tableState, setTableState } = useTable();
    return tableState.isExpanded ? (
        <tbody>
            {children}
        </tbody>
    ) : (
        <div className='flex-1 flex border-t-[1px] border-neutral-400 pt-2'>
            {children}
        </div>
    );
}

export const TableRow = ({ children }:
    { children?: React.ReactNode }) => {
    const { tableState, setTableState } = useTable();
    return tableState.isExpanded ? (
        <tr className='hover:bg-neutral-300 duration-150'>
            {children}
        </tr>
    ) : (
        <div className='flex flex-col flex-1'>
            {children}
        </div>
    );
}
