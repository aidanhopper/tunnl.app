import { useState } from 'react';

export const useExistingStoredState = (key: string) => {
    const item = window.localStorage.getItem(key);
    return !item || item === 'undefined' ? null : JSON.parse(item);
}

export const useStoredState = <T>(key: string, def: T) => {
    const item = window.localStorage.getItem(key);
    const v = !item || item === 'undefined' ? def : JSON.parse(item);
    const [value, setValue] = useState(v);
    return [value, (newValue: T) => {
        window.localStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
    }]
}

export const useNavPath = () => {
    return window.location.pathname.split('/').filter(s => s !== '').map(s => decodeURIComponent(s));
}
