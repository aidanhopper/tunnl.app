const ziti = require('./ziti');
const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const client = new pg.Client({
    host: `${process.env.PG_HOST}`,
    port: process.env.PG_PORT,
    user: `${process.env.PG_USER}`,
    password: `${process.env.PG_PASSWORD}`,
    database: `${process.env.PG_DATABASE}`,
});


client.connect()
    .then(() => console.log("Connected to PostgreSQL DB"))
    .catch(err => console.error("Error", err.stack));

const insertService = async (service) => {
    const zitiInterceptId = await ziti.createConfig({
        name: ziti.interceptConfig(service.id),
        configTypeId: await ziti.getConfigType('intercept.v1'),
        data: {
            portRanges: ziti.getPortRangeObjs(service.are_ports_forwarded ? service.port_range : service.access_port),
            addresses: [service.domain],
            protocols: ['tcp', 'udp'],
        }
    });

    const zitiHostId = await ziti.createConfig({
        name: ziti.hostConfig(service.id),
        configTypeId: await ziti.getConfigType('host.v1'),
        data: {
            address: service.host,
            forwardPort: service.are_ports_forwarded ? true : undefined,
            forwardProtocol: true,
            allowedPortRanges: service.are_ports_forwarded ? ziti.getPortRangeObjs(service.port_range) : undefined,
            port: !service.are_ports_forwarded ? Number(service.source_port) : undefined,
            allowedProtocols: ['tcp', 'udp'],
            httpChecks: [],
            portChecks: [],
        }
    });

    const zitiServiceId = await ziti.createService({
        name: service.id,
        configs: [zitiHostId, zitiInterceptId]
    });

    await ziti.createServiceDialPolicy({
        name: service.id,
        serviceId: zitiServiceId,
    });

    const identity = await ziti.getIdentity(service.device_id);

    await ziti.createServiceBindPolicy({
        name: service.id,
        serviceId: zitiServiceId,
        identityId: identity.id,
    });
}

const updateService = async (service) => {
    console.log(service);
    const interceptConfig = await ziti.getConfig(ziti.interceptConfig(service.id));
    const hostConfig = await ziti.getConfig(ziti.hostConfig(service.id));

    const interceptId = interceptConfig.id;
    const hostId = hostConfig.id;

    await ziti.patchConfig({
        id: hostId,
        data: {
            data: {
                address: service.host,
                forwardPort: true,
                forwardProtocol: true,
                allowedPortRanges: ziti.getPortRangeObjs(service.port_range),
                allowedProtocols: ['tcp', 'udp'],
                httpChecks: [],
                portChecks: [],
            }
        }
    });

    await ziti.patchConfig({
        id: interceptId,
        data: {
            data: {
                portRanges: ziti.getPortRangeObjs(service.port_range),
                addresses: [service.domain],
                protocols: ['tcp', 'udp'],
            }
        }
    })
}

const deleteService = async (service) => {
    try {
        const name = service.id;

        const srv = await ziti.getService(name);
        const hostConfig = await ziti.getConfig(ziti.hostConfig(name));
        const interceptConfig = await ziti.getConfig(ziti.interceptConfig(name));
        const dialPolicy = await ziti.getPolicy(ziti.dialPolicy(name));
        const bindPolicy = await ziti.getPolicy(ziti.bindPolicy(name));

        await ziti.deletePolicy(dialPolicy.id);
        await ziti.deletePolicy(bindPolicy.id);
        await ziti.deleteConfig(hostConfig.id);
        await ziti.deleteConfig(interceptConfig.id);
        await ziti.deleteService(srv.id);

        const r = await client.query(`
            (
                SELECT id
                FROM devices
                WHERE user_id IN (
                    SELECT user_id 
                    FROM members
                    WHERE community_id IN (
                    SELECT community_id 
                        FROM members 
                        WHERE id IN (
                            SELECT member_id
                            FROM shares
                            WHERE service_id = $1
                        )
                    )
                )
            )
            UNION
            (
                SELECT id
                FROM devices
                WHERE user_id = $2
            )
        `, [service.id, service.user_id]);

        r.rows.forEach(async ({ id: deviceId }) => {
            const identity = await ziti.getIdentity(deviceId);
            const roleAttributes = identity.roleAttributes ?
                identity.roleAttributes
                    .filter(role => role !== ziti.dialRole(service.id)) : [];
            await ziti.updateIdentity({
                id: identity.id,
                data: { roleAttributes: roleAttributes },
            });
        });
    } catch (err) { console.error(err); }
}

const userServices = async (userId) => {
    const r = await client.query(`
        (
            SELECT id
            FROM services
            WHERE user_id = $1
        )
        UNION
        (
            SELECT service_id
            FROM shares
            WHERE member_id IN (
                SELECT id
                FROM members
                WHERE community_id IN (
                    SELECT community_id
                    FROM members
                    WHERE user_id = $1
                )
            )
        )
    `, [userId]);

    return r.rows;
}

const userOnlineDevices = async (userId) => {
    const r = await client.query(`
        SELECT id
        FROM devices
        WHERE user_id = $1 AND is_tunnel_online = true
    `, [userId]);
    return r.rows;
}

const userOfflineDevices = async (userId) => {
    const r = await client.query(`
        SELECT id
        FROM devices
        WHERE user_id = $1 AND is_tunnel_online = false
    `, [userId]);
    return r.rows;
}

const updateRoles = async (userIds) => {
    try {
        userIds.forEach(async userId => {
            const onlineDevices = await userOnlineDevices(userId);
            const offlineDevices = await userOfflineDevices(userId);
            const services = await userServices(userId);

            onlineDevices.forEach(async ({ id }) => {
                const identity = await ziti.getIdentity(id);

                await ziti.updateIdentity({
                    id: identity.id,
                    data: {
                        roleAttributes: services.map(s => ziti.dialRole(s.id)),
                    },
                });
            });

            offlineDevices.forEach(async ({ id }) => {
                const identity = await ziti.getIdentity(id);

                await ziti.updateIdentity({
                    id: identity.id,
                    data: {
                        roleAttributes: [],
                    },
                });
            });
        });
    } catch (err) { console.error(err) }
}

const removeDeviceRoles = async (hwid) => {
    const identity = await ziti.getIdentity(hwid);

    await ziti.updateIdentity({
        id: identity.id,
        data: {
            roleAttributes: [],
        },
    });
}

module.exports = {
    insertService, deleteService, updateRoles, removeDeviceRoles, updateService,
}
