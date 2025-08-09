import '@/styles/globals.css';
import type { ReactNode } from 'react';

const Code = ({ children, className = '' }: { children?: ReactNode, className?: string }) => {
    return (
        <code className={`bg-neutral-100 rounded ${className}`}>
            {children}
        </code>
    );
}

export default Code;
