import React, { useEffect, useMemo } from 'react';
import { SocketContext } from './socket';
import { io } from 'socket.io-client';
import { useUser } from './user';

const SocketProvider = ({ children }: { children?: React.ReactNode }) => {
    const socket = useMemo(() => io('/', {
        path: '/web.sock',
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
    }), []);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server socket.io server');
        });

        socket.on('connect_error', (err) => {
            console.error('Connection error:', err.message);
            console.error(err);
        });

        socket.on('disconnect', () => {
            console.warn('Disconnected from socket.io server')
        });
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;
