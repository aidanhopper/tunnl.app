'use server'

import axios from 'axios';

const managementAPI = `${process.env.ZITI_CONTROLLER_URL}/edge/management/v1`;

interface Auth {
    token: string
    expires: Date
}

interface TokenResponse {
    data: {
        token: string
        expiresAt: string
    }
}

const auth: Auth = { token: '', expires: new Date() }

export const token = async () => {
    if (auth && auth.token !== '' && auth.expires > new Date()) return auth.token;

    const url = `${managementAPI}/authenticate?method=password`;
    const r = await axios.post<TokenResponse>(
        url,
        {
            username: process.env.ZITI_ADMIN_USERNAME,
            password: process.env.ZITI_ADMIN_PASSWORD,
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const data = r.data.data;

    const token = data.token;
    const expires = new Date(data.expiresAt);

    auth.token = token;
    auth.expires = expires;

    return auth.token;
}

export const get = async <T>({ route, filter }: { route: string, filter?: string }) => {
    try {
        const url = `${managementAPI}${route}`;
        const r = await axios.get(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await token(),
                },
                params: {
                    filter: filter
                },
            },
        );
        return r.data as T;
    } catch (err) {
        console.error(err)
        return null
    }
}

export const post = async <T>({ route, data }: { route: string, data?: object }) => {
    try {
        const url = `${managementAPI}${route}`;
        const r = await axios.post<T>(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await token(),
                },
            },
        );
        return r.data as T;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const del = async ({ route }: { route: string }) => {
    try {
        const url = `${managementAPI}${route}`;
        const r = await axios.delete(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await token(),
                },
            },
        );
        return r.status === 200 || r.status === 404;
    } catch { return false }
}

export const patch = async ({ route, data }: { route: string, data: object }) => {
    try {
        const url = `${managementAPI}${route}`;
        const r = await axios.patch(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await token(),
                },
            },
        );
        return r.status === 200 || r.status === 404;
    } catch (err) {
        console.error(err);
        return false
    }
}
