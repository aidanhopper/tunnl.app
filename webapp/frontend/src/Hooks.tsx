import { useEffect, useState } from 'react';
import { session } from './API';

export const useSession = (user: any, callback: (data: any, success: boolean) => void) => {
    useEffect(() => {
        if (user === null) {
            session().then(([data, status]) => {
                callback(data, status === 200);
            });
        }
    }, [callback, user]);
}

export const useUser = (): [string | null, (newUser: string | null) => void] => {
    const [user, setUser] = useState<string | null>(null);
    useSession(user, (data, success) => {
        if (success) setUser(data.user.email);
    });
    return [user, setUser];
}
