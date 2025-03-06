import { createContext, useContext, useState } from 'react';

export type User = {
    email: string,
    pictureURL: string,
    token: string,
    displayName: string,
    devices: {
        id: string,
        name: string,
    }[],
    services: {
        domain: string,
        name: string,
        host: string,
        portRange: string,
        description: string,
        deviceID: string,
    }[],
    communities: {
        id: string,
        name: string,
        description: string,
        owner: boolean,
    }[],
}

type UserContextType = {
    user: User | null,
    setUser: (user: User | null) => void,
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children?: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context)
        throw new Error("useUser must be used within a UserProvider");
    return context;
}
