const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config({ path: '../.env' });

const managementAPI = `${process.env.ZITI_CONTROLLER_URL}/edge/management/v1`;

let apiToken = '';

const getToken = async () => {
    if (apiToken !== '')
        return apiToken;
    const url = `${managementAPI}/authenticate?method=password`;
    const response = await axios.post(url,
        {
            username: process.env.ZITI_ADMIN_USERNAME,
            password: process.env.ZITI_ADMIN_PASSWORD,
        },
        {
            Headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const token = response.data.data.token;
    apiToken = token.trim();
    console.log(apiToken);
    return apiToken;
}

const createIdentity = async (name) => {
    try {
        const url = `${managementAPI}/identities`;

        const r = await axios.post(url,
            {
                name: name,
                isAdmin: false,
                type: 'Device',
                roleAttributes: [],
                enrollment: {
                    ott: true,
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await getToken(),
                }
            },
        );

        if (r.status !== 201) return { success: false, id: null };

        return { success: true, id: r.data.data.id };
    } catch (err) {
        return { success: false, id: null };
    }
}

const getIdentity = async (name) => {
    try {
        const url = `${managementAPI}/identities`;
        const r = await axios.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await getToken(),
                },
                params: {
                    filter: `name="${name}"`
                }
            }
        );

        const data = r.data.data;

        const identity = data[0];

        return { success: true, id: identity.id }
    } catch { return { success: false, id: null } }
}

const getIdentityJWT = async (id) => {
    try {
        const url = `${managementAPI}/identities/${id}/enrollments`;

        const r = await axios.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await getToken(),
                },
            }
        );

        return { success: true, jwt: r.data.data[0].jwt }
    } catch { return { success: false, jwt: null } }
}

module.exports = { createIdentity, getIdentity, getIdentityJWT }
