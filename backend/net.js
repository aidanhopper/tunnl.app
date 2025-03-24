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
    const zitiInterceptId = await ziti.createInterceptConfig({
        name: service.id,
        portRange: service.port_range,
        address: service.domain,
    });

    const zitiHostId = await ziti.createHostConfig({
        name: service.id,
        portRange: service.port_range,
        host: service.host,
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

const userDevices = async (userId) => {
    const r = await client.query(`
        SELECT id
        FROM devices
        WHERE user_id = $1
    `, [userId]);
    return r.rows;
}

const updateRoles = async (userIds) => {
    try {
        userIds.forEach(async userId => {
            const devices = await userDevices(userId);
            const services = await userServices(userId);

            devices.forEach(async ({ id }) => {
                const identity = await ziti.getIdentity(id);

                await ziti.updateIdentity({
                    id: identity.id,
                    data: {
                        roleAttributes: services.map(s => ziti.dialRole(s.id)),
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
    insertService, deleteService, updateRoles, removeDeviceRoles
}
