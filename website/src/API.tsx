import axios from 'axios'

const authenticateDaemon = async (userid: string) => {
    return await axios.post(`http://localhost:45789/v1/authenticate/${encodeURIComponent(userid)}`);
}

const getUser = async (token: string) => {
    return await axios.get(`/api/v1/user`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
}

const startTunneler = async (hwid: string, token: string) => {
    return await axios.post(`/api/v1/daemon/start`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                hwid: hwid
            }
        })
}

export { authenticateDaemon, getUser, startTunneler }
