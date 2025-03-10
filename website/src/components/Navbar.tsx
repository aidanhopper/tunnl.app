import Container from './Container';
import StickyContainer from './StickyContainer';
import { useEffect, useRef, useState } from 'react';

export const Navbar = ({ children, className, onStick, onUnstick }:
    { children?: React.ReactNode, className?: string, onStick?: () => void, onUnstick?: () => void }) => {

    const [isStuck, setIsStuck] = useState(false);
    const navRef = useRef<HTMLDivElement>(null)
    const [navBottom, setNavBottom] = useState(0);

    useEffect(() => {
        if (!navRef.current) return;
        const box = navRef.current.getBoundingClientRect();
        setNavBottom(box.y);
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setIsStuck(window.scrollY > navBottom); // Adjust the threshold as needed
            if (!isStuck && window.scrollY > navBottom && onStick) onStick();
            if (isStuck && window.scrollY <= navBottom && onUnstick) onUnstick();
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [navBottom, isStuck, onUnstick, onStick]);

    return (
        <StickyContainer>
            <div className={`w-full ${className}`} ref={navRef}>
                <Container>
                    <nav className={`flex py-1 w-full`}>
                        {children}
                    </nav>
                </Container>
            </div>
        </StickyContainer>
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
