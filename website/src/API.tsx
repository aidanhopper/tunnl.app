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

export { authenticateDaemon, getUser }
