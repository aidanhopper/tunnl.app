'use client'

import React from 'react';

const Content = ({
    children,
    className = '',
}: {
    children?: React.ReactNode,
    className?: string,
}) => {
    console.log(children);
    return (
        <div className={`mx-auto px-4 w-full max-w-6xl ${className}`}>
            {children}
        </div>
    );
}

export default Content;