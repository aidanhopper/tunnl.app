import React, { createContext, useContext } from 'react';
import { useUser } from './Hooks';

type UserContextType = {
    user: any,
    setUser: (newUser: any) => void,
}

const UserContext = createContext<UserContextType | null>(null);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a provider.");
    }
    return [context.user, context.setUser];
}

export const UserContextProvider = ({ children }: any) => {
    const [user, setUser] = useUser();
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;
