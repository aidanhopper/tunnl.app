import { useState } from 'react';

export const useStoredState = <T>(key: string, def: T) => {
    const v = window.sessionStorage.getItem(key);
    const [value, setValue] = useState(v ? JSON.parse(v) : def);
    return [value, (newValue: T) => {
        window.sessionStorage.setItem(key, JSON.stringify(newValue));
        setValue(newValue);
    }]
}

