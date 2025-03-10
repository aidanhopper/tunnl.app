import { useEffect, useRef, useState } from 'react';

export const StickyContainer = ({ children, offsetTop = 0 }:
    { children?: React.ReactNode, offsetTop?: number }) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = useState(false);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [left, setLeft] = useState(0);

    useEffect(() => {
        // Get initial dimensions
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setHeight(rect.height);
            setWidth(rect.width);
            setLeft(rect.left);
        }

        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const shouldBeSticky = rect.top <= offsetTop;

                if (shouldBeSticky !== isSticky) {
                    setIsSticky(shouldBeSticky);
                }

                // Update position if not sticky (when scrolling back up)
                if (!shouldBeSticky) {
                    setLeft(rect.left);
                }
            }
        };

        const handleResize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setHeight(rect.height);
                setWidth(rect.width);
                if (!isSticky) {
                    setLeft(rect.left);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [isSticky, offsetTop])

    return (
        <>
            <div ref={containerRef} style={{ height: isSticky ? height : 'auto' }}>
                <div style={{
                    position: isSticky ? 'fixed' : 'static',
                    top: isSticky ? offsetTop : undefined,
                    left: isSticky ? left : undefined,
                    width: isSticky ? width : '100%',
                    height: 'auto',
                }}>
                    {children}
                </div>
            </div>
        </>
    );
}

export default StickyContainer;
