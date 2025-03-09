import { useContext, createContext } from 'react';

export type User = {
    id: string,
    email: string,
    name: string,
    displayName: string,
    googleid: string,
    picture: string,
    lastLogin: string,
    createdAt: string,
    devices: {
        id: string,
        lastLogin: string,
        createdAt: string,
        hostname: string,
        displayName: string,
        isOnline: boolean,
    }[],
}

export const UserContext = createContext<{
    user: User | null, setUser: (value: User) => void
} | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
}
