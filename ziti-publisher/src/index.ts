import axios from 'axios';
import fs from 'fs/promises';

const managementAPI = `${process.env.ZITI_CONTROLLER_URL}/edge/management/v1`;

const readApiData = async () => {
    try {
        return await JSON.parse(await fs.readFile('ziti-api-data.json', 'utf-8'));
    } catch { return { token: '', expires: null } }
}

let apiAuth = readApiData();

const getToken = async () => {
    if (apiAuth.token !== '' && apiAuth.expires > new Date()) return apiAuth.token;

    const url = `${managementAPI}/authenticate?method=password`;
    const r = await axios.post(url,
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

    apiAuth.token = token;
    apiAuth.expires = expires;

    fs.writeFileSync('ziti-api-data.json', JSON.stringify(apiAuth, null, 4));

    return apiAuth.token;
}

const queryZiti = () => {

}
