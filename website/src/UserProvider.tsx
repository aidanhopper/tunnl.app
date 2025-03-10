import React, { useEffect } from 'react';
import { getUser } from './API';
import { useStoredState } from './hooks';
import { User, UserContext } from './user';

// can throw a websocket in here to update user data when nessesary

export const UserProvider = ({ children }: { children?: React.ReactNode }) => {
    const [user, setUser] = useStoredState<User | null>('user data', null);

    useEffect(() => {
        if (user) return;
        if (!document.cookie.includes('tunnl_session=')) return;
        getUser().then(r => {
            if (r.status !== 200) return;
            setUser(r.data);
        });
    }, [user, setUser]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
