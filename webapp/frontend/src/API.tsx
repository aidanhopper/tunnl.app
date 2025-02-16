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
    console.log(res);
    return [await res.json(), res.status];
}
