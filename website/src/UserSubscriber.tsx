import { useSocket } from './socket';
import { useUser } from './user';
import { useEffect } from 'react';

const UserSubscriber = ({ children }: { children?: React.ReactNode }) => {
    const socket = useSocket();
    const { user, setUser } = useUser();

    useEffect(() => {
        if (!user) socket.disconnect();
        else {
            socket.connect();
            socket.on('user:update', u => setUser(u))
        };
    }, [user, socket, setUser]);

    return (
        <>
            {children}
        </>
    )
}


export default UserSubscriber;
