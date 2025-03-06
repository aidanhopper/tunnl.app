import request from './request';

const url = "http://localhost:5174";
const apiUrl = `${url}/api/v1`;

const getHello = async () => {
    return await request({
        url: `${apiUrl}/hello`,
        method: "GET",
    });
}

const getProfile = async (token: string) => {
    return await request({
        url: `${apiUrl}/user/profile`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

const postDevice = async (id: string, name: string, token: string) => {
    return await request({
        url: `${apiUrl}/user/device`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            id: id,
            name: name
        }
    });
}

const postService = async (name: string, domain: string,
    host: string, portRange: string, deviceID: string, token: string) => {
    return await request({
        url: `${apiUrl}/user/service`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            name: name,
            domain: domain,
            host: host,
            portRange: portRange,
            deviceID: deviceID,
        }
    });
}

const deleteService = async (name: string, token: string) => {
    return await request({
        url: `${apiUrl}/user/service`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            name: name,
        }
    });
}

const postCommunity = async (name: string, token: string) => {
    return await request({
        url: `${apiUrl}/user/community`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            name: name,
        }
    });
}

const deleteCommunity = async (name: string, token: string) => {
    return await request({
        url: `${apiUrl}/user/community`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: {
            name: name,
        }
    });
}

export {
    getHello, getProfile, postDevice, postService, deleteService,
    postCommunity, deleteCommunity
};
