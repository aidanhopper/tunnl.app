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

export const updateDeviceName = async (hwid: string, name: string) => {
    return await axios.patch(`/api/v1/daemon/${encodeURIComponent(hwid)}/name`,
        {
            withCredentials: true,
            data: {
                name: name,
            }
        });
}

export const updateDisplayName = async (name: string) => {
    return await axios.patch(`/api/v1/user/name`,
        {
            withCredentials: true,
            data: {
                name: name,
            }
        });
}

export const deleteDevice = async (hwid: string) => {
    return await axios.delete(`/api/v1/daemon/${encodeURIComponent(hwid)}`,
        {
            withCredentials: true,
        });
}

export const updateTunnelAutostart = async (hwid: string, value: boolean) => {
    return await axios.patch(`/api/v1/daemon/${encodeURIComponent(hwid)}/autostart`,
        {
            withCredentials: true,
            data: {
                value: value,
            }
        });
}

export const postService = async (hwid: string, name: string, domain: string, host: string, portRange: string) => {
    return await axios.post(`/api/v1/service/${encodeURIComponent(hwid)}`,
        {
            withCredentials: true,
            data: {
                name: name,
                domain: domain,
                host: host,
                portRange: portRange,
            }
        });
}

export const updateService = async (serviceid: string, name: string | null, domain:
    string | null, host: string | null, portRange: string | null, deviceid: string | null) => {
    return await axios.patch(`/api/v1/service/${encodeURIComponent(serviceid)}`,
        {
            withCredentials: true,
            data: {
                name: name,
                domain: domain,
                host: host,
                portRange: portRange,
                deviceid: deviceid
            }
        });
}

export const deleteService = async (serviceid: string) => {
    return await axios.delete(`/api/v1/service/${encodeURIComponent(serviceid)}`,
        {
            withCredentials: true,
        });
}

export const postCommunity = async (name: string) => {
    return await axios.post('/api/v1/community',
        {
            withCredentials: true,
            data: { name: name }
        });
}

export const postInvite = async (communityid: string, isOneTimeUse: boolean, expires: Date) => {
    return await axios.post('/api/v1/invite',
        {
            withCredentials: true,
            data: {
                communityid: communityid,
                isOneTimeUse: isOneTimeUse,
                expires: expires,
            }
        });
}

export const isInviteValid = async (code: string) => {
    return await axios.get(`/api/v1/invite/${encodeURIComponent(code)}`,
        {
            withCredentials: true,
        });
}
