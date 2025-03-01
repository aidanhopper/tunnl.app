import request from './request';

const url = "http://localhost:3001";
const apiUrl = `${url}/api/v1`;

const getHello = async () => {
    return await request({
        url: `${apiUrl}/hello`,
        method: "GET",
    });
}

const postAuthGoogle = async (code: string) => {
    const response = await request({
        url: `${apiUrl}/auth/google/${encodeURIComponent(code)}`,
        method: "POST",
    });

    return response;
}

export { getHello, postAuthGoogle };
