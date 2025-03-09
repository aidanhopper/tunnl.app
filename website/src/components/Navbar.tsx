export const Navbar = ({ children, className }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <nav className={`flex px-10 py-1 w-full ${className}`}>
            {children}
        </nav>
    );
}

export const NavbarSection = ({ children, className }:
    { children?: React.ReactNode, className?: string }) => {
    return (
        <div className={`flex-1 items-center py-2 flex ${className}`}>
            {children}
        </div>
    );
}
