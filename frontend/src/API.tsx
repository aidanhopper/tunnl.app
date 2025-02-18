export const session = async () => {
    const url = "/api/v1/session"
    const res = await fetch(url, { credentials: "include" });
    return [await res.json(), res.status];
}

export const logout = async () => {
    const url = "/api/v1/logout"
    const res = await fetch(url,
        {
            method: "POST",
            credentials: "include",
        }
    );
    return [await res.json(), res.status];
}

export const login = async (email: string, password: string) => {
    const url = "/api/v1/login"
    const res = await fetch(url,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        }
    );
    return [await res.json(), res.status];
}

export const register = async (email: string, password: string) => {
    const url = "/api/v1/register"
    const res = await fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        }
    );
    return [await res.json(), res.status];
}

export const postDevice = async (key: string) => {
    const url = `/api/v1/device/${key}`;
    const res = await fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return [await res.json(), res.status];
}

export const deleteDevice = async (ip: string) => {
    const url = `/api/v1/device/${ip}`;
    const res = await fetch(url,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return [await res.json(), res.status];
}

export const getUserData = async () => {
    const url = `/api/v1/user`;
    const res = await fetch(url,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    return [await res.json(), res.status];
}
