import { useContext, createContext } from 'react';

export type Device = {
    id: string,
    lastLogin: string,
    createdAt: string,
    hostname: string,
    displayName: string,
    dnsIpRange: string,
    isDaemonOnline: boolean,
    isTunnelOnline: boolean,
    isTunnelAutostart: boolean,
}

export type Service = {
    id: string,
    deviceid: string,
    name: string,
    domain: string,
    host: string,
    portRange: string,
    createdAt: string,
}

export type User = {
    id: string,
    email: string,
    name: string,
    displayName: string,
    googleid: string,
    picture: string,
    lastLogin: string,
    createdAt: string,
    devices: Device[]
    services: Service[],
}

export const UserContext = createContext<{ user: User | null, setUser: (value: User | null) => void } | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
}
