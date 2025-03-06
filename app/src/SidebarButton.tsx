import { Link } from 'react-router-dom';

const SidebarButton = ({ active, to, children }: { active: boolean, to: string, children?: React.ReactNode }) => {
    return (
        <Link
            to={to}
            className={`font-bold text-lg mb-4 text-left px-4 py-1 hover:text-black 
            duration-150 rounded-sm hover:bg-white flex items-center justify-start
            group format ${!active ? "" : "bg-neutral-700"}`}>
            {children}
        </Link>
    );
}

export default SidebarButton;
