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

const updateDialRoles = async (service) => {
    const ownerDevicesResponse = await client.query(`
        SELECT id
        FROM devices
        WHERE user_id = (
            SELECT user_id
            FROM devices
            WHERE id = $1
        )
    `, [service.device_id]);

    const ownerDevices = ownerDevicesResponse.rows;

    ownerDevices.forEach(async ({ id }) => {
        const identity = await ziti.getIdentity(id);

        const roleAttributes = identity.roleAttributes
            ? identity.roleAttributes : [];

        await ziti.updateIdentity({
            id: identity.id,
            data: {
                roleAttributes: [
                    ...roleAttributes,
                    ziti.dialRole(service.id)
                ],
            },
        });
    });
}

module.exports = { insertService, updateDialRoles }
