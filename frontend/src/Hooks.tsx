import { useEffect, useState } from 'react';
import { session, getUserData } from './API';
import { useUserContext } from './UserContext';

export const useSession = (user: any, callback: (data: any, success: boolean) => void) => {
    useEffect(() => {
        if (user === null || user === undefined) {
            session().then(([data, status]) => {
                callback(data, status === 200);
            });
        }
    }, [callback, user]);
}

export const useUser = (): [any, (newUser: any) => void] => {
    const [user, setUser] = useState<any>(null);
    useSession(user, (_, success) => {
        if (success) getUserData().then(([d, status]) => {
            console.log("query")
            if (status === 200) setUser(d);
        });
    });
    return [user, setUser];
}

export const useSaveString = (storageName: string, defaultValue: string):
    [string, (newValue: string) => void] => {
    const storedValue = sessionStorage.getItem(storageName);
    const [value, setValue_] = useState<string>(
        storedValue === null ? defaultValue : storedValue);
    const setValue = (newValue: string) => {
        sessionStorage.setItem(storageName, newValue)
        setValue_(newValue);
    }
    return [value, setValue];
}

