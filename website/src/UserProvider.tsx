import React, { useEffect, useMemo } from 'react';
import { getUser } from './API';
import { useStoredState } from './hooks';
import { User, UserContext } from './user';

// can throw a websocket in here to update user data when nessesary

const UserProvider = ({ children }: { children?: React.ReactNode }) => {
    const [user, setUser] = useStoredState<User | null>('user data', null);
    const [hasQueried, setHasQueried] = useStoredState('user has been queried', false);

    useEffect(() => {
        if (user || hasQueried) return;
        getUser().then(r => {
            if (r.status !== 200) return;
            setHasQueried(true);
            setUser(r.data);
        });
    }, [user, setUser, hasQueried, setHasQueried]);

    console.log(user);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
