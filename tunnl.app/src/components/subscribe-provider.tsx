'use client'

import { ReactNode } from "react";
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const SubscribeProvider = ({ children, token }: { children?: ReactNode, token: string }) => {
    if (!socket)
        socket = io(process.env.NEXT_PUBLIC_PUBLISHER_URL, {
            auth: { token: token }
        });

    socket.on('event', console.log);

    return (
        <>
            {children}
        </>
    )
}

export default SubscribeProvider;
