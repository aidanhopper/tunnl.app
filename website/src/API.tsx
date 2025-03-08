import axios from 'axios'

const authenticateDaemon = async (userid: string) => {
    return await axios.post(`http://localhost:45789/v1/authenticate/${encodeURIComponent(userid)}`);
}

const getUser = async () => {
    return await axios.get(`/api/v1/user`, {
        withCredentials: true,
    });
}

const startTunneler = async (hwid: string) => {
    return await axios.post(`/api/v1/daemon/${encodeURIComponent(hwid)}/start`,
        {
            withCredentials: true,
        });
}

const stopTunneler = async (hwid: string) => {
    return await axios.post(`/api/v1/daemon/${encodeURIComponent(hwid)}/stop`,
        {
            withCredentials: true,
        });
}

const getTunnelerStatus = async (hwid: string) => {
    return await axios.get(`/api/v1/daemon/${encodeURIComponent(hwid)}/status`,
        {
            withCredentials: true,
        });
}

export { authenticateDaemon, getUser, startTunneler, stopTunneler, getTunnelerStatus }
