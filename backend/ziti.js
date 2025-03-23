const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');

dotenv.config({ path: '../.env' });

const managementAPI = `${process.env.ZITI_CONTROLLER_URL}/edge/management/v1`;

const readApiData = () => {
    try {
        return JSON.parse(fs.readFileSync('ziti-api-data.json', 'utf-8'));
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
                },
            },
        );

        if (r.status !== 201) return null;

        return r.data.data.id;
    } catch (err) { return null; }
}

const get = async ({ name, route }) => {
    try {
        if (!name) return null;

        const url = `${managementAPI}${route}`;
        const r = await axios.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await getToken(),
                },
                params: {
                    filter: `name="${name}"`
                },
            },
        );

        return r.data.data[0];
    } catch { return null }
}

const del = async ({ id, route }) => {
    try {
        if (!id) return false;

        const url = `${managementAPI}${route}/${id}`;
        const r = await axios.delete(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await getToken(),
                },
            },
        );
        return true;
    } catch { return false }
}

const getIdentity = (name) => get({ name: name, route: '/identities' })

const updateIdentity = async ({ id, data }) => {
    try {
        const url = `${managementAPI}/identities/${id}`;
        await axios.patch(url,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await getToken(),
                },
            },
        );
    } catch (err) {
        console.error(err.response.data);
    }
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
            },
        );

        return r.data.data[0].jwt;
    } catch { return null }
}

const createService = async ({ name, configs }) => {
    try {
        const url = `${managementAPI}/services`;

        const r = await axios.post(url,
            {
                encryptionRequired: true,
                name: name,
                terminatorStrategy: 'smartrouting',
                configs: configs,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await getToken(),
                },
            },
        );
        return r.data.data.id
    } catch (err) {
        console.error(err.response.data);
        return null;
    }
}

const createConfig = async (data) => {
    try {
        const url = `${managementAPI}/configs`;

        const r = await axios.post(url,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await getToken(),
                },
            },
        );

        return r.data.data.id;
    } catch (err) {
        if (err && err.response && err.response.data)
            console.log(err.response.data);
        else
            console.log(err);
        return null;
    }
}

const createServicePolicy = async (data) => {
    try {
        const url = `${managementAPI}/service-policies`;

        const r = await axios.post(url,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await getToken(),
                },
            },
        );

    } catch (err) {
        console.error(err.response.data);
    }
}

const configTypes = new Map();

const getConfigType = async (name) => {
    try {
        if (configTypes.has(name))
            return configTypes.get(name);

        const url = `${managementAPI}/config-types`;

        const r = await axios.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'zt-session': await getToken(),
                },
                params: {
                    filter: `name="${name}"`
                },
            }
        );

        configTypes.set(name, r.data.data[0].id);
        return r.data.data[0].id;
    } catch (err) {
        console.error(err.response.data);
        return null;
    }
}

const getPortRangeObjs = (portRange) =>
    portRange
        .split(' ')
        .filter(e => e !== '')
        .map(range => {
            range = range.split('-').map(e => Number(e));

            if (range.length === 2)
                return {
                    high: range[1],
                    low: range[0],
                }

            return {
                high: range[0],
                low: range[0],
            }
        });

const interceptConfig = (name) => `${name}-intercept-config`

const createInterceptConfig = async ({ name, portRange, address }) => {
    try {
        const config = await createConfig({
            name: interceptConfig(name),
            configTypeId: await getConfigType('intercept.v1'),
            data: {
                portRanges: getPortRangeObjs(portRange),
                addresses: [address],
                protocols: ['tcp', 'udp'],
            }
        });
        return config;
    } catch (err) {
        console.error(err)
        return null;
    }
}

const hostConfig = (name) => `${name}-host-config`;

const createHostConfig = async ({ name, portRange, host }) => {
    try {
        const config = await createConfig({
            name: hostConfig(name),
            configTypeId: await getConfigType('host.v1'),
            data: {
                address: host,
                forwardPort: true,
                forwardProtocol: true,
                allowedPortRanges: getPortRangeObjs(portRange),
                allowedProtocols: ['tcp', 'udp'],
                httpChecks: [],
                portChecks: [],
            }
        });
        return config;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const dialPolicy = (name) => `${name}-dial-policy`;

const createServiceDialPolicy = async ({ name, serviceId }) => {
    try {
        await createServicePolicy({
            name: dialPolicy(name),
            semantic: 'AnyOf',
            serviceRoles: [
                `@${serviceId}`,
            ],
            identityRoles: [
                `#${dialRole(name)}`
            ],
            type: 'Dial',
        });
    } catch (err) {
        console.error(err);
    }
}

const bindPolicy = (name) => `${name}-bind-policy`;

const createServiceBindPolicy = async ({ name, serviceId, identityId }) => {
    try {
        await createServicePolicy({
            name: bindPolicy(name),
            semantic: 'AnyOf',
            serviceRoles: [
                `@${serviceId}`,
            ],
            identityRoles: [
                `@${identityId}`
            ],
            type: 'Bind',
        });
    } catch (err) {
        console.error(err);
    }
}

const dialRole = (serviceId) => `${serviceId}-dial`;

const getService = (name) => get({ name: name, route: '/services' });

const deleteService = (id) => del({ id: id, route: '/services' });

const getConfig = (name) => get({ name: name, route: '/configs' });

const deleteConfig = (id) => del({ id: id, route: '/configs' });

const getPolicy = async (name) => get({ name: name, route: '/service-policies' });

const deletePolicy = async (id) => del({ id: id, route: '/service-policies' });

module.exports = {
    createIdentity, getIdentity, getIdentityJWT, createService, createConfig,
    getConfigType, createInterceptConfig, createHostConfig, createServicePolicy,
    createServiceDialPolicy, createServiceBindPolicy, updateIdentity, dialRole,
    getService, getConfig, hostConfig, interceptConfig, dialPolicy, getPolicy,
    deleteService, deleteConfig, deletePolicy, bindPolicy,
}
