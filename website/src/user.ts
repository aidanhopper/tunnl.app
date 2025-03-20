import { useContext, createContext } from 'react';

export type Device = {
    id: string
    lastLogin: string
    createdAt: string
    hostname: string
    displayName: string
    dnsIpRange: string
    isDaemonOnline: boolean
    isTunnelOnline: boolean
    isTunnelAutostart: boolean
}

export type Service = {
    id: string
    deviceid: string
    name: string
    domain: string
    host: string
    portRange: string
    createdAt: string
}

export type PublicService = {
    id: string
    name: string
    domain: string
    portRange: string
    ownerDisplayName: string,
    ownerid: string
}

export type Share = {
    id: string
    service: PublicService
}

export type Member = {
    id: string
    displayName: string
    shares: Share[]
}

export type Membership = {
    id: string
    community: Community
}

export type Community = {
    id: string
    name: string
    createdAt: string
    members: Member[]
}

export type User = {
    id: string
    email: string
    name: string
    displayName: string
    googleid: string
    picture: string
    lastLogin: string
    createdAt: string
    devices: Device[]
    services: Service[]
    communities: Community[]
    memberships: Membership[]
}

export const UserContext = createContext<{ user: User | null, setUser: (value: User | null) => void } | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
}
