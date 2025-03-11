import axios from 'axios'

export const postLogout = async () => {
    return await axios.post(`/api/v1/user/logout`,
        {
            withCredentials: true,
        });
}

export const authenticateDaemon = async (userid: string) => {
    return await axios.post(`http://localhost:45789/v1/authenticate/${encodeURIComponent(userid)}`);
}

export const getHostname = async () => {
    return await axios.get(`http://localhost:45789/v1/hostname`);
}

export const getUser = async () => {
    return await axios.get(`/api/v1/user`, {
        withCredentials: true,
    });
}

export const startTunneler = async (hwid: string) => {
    return await axios.post(`/api/v1/daemon/${encodeURIComponent(hwid)}/start`,
        {
            withCredentials: true,
        });
}
 
export const stopTunneler = async (hwid: string) => {
    return await axios.post(`/api/v1/daemon/${encodeURIComponent(hwid)}/stop`,
        {
            withCredentials: true,
        });
}

export const getTunnelerStatus = async (hwid: string) => {
    return await axios.get(`/api/v1/daemon/${encodeURIComponent(hwid)}/status`,
        {
            withCredentials: true,
        });
}
