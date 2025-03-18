const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');
const pg = require('pg');
const http = require('http');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const socketIo = require('socket.io');
const fs = require('fs');

dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 3123;

const app = express();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const server = http.createServer(app);

const webio = socketIo(server, { path: '/web.sock' });
const daemonio = socketIo(server, { path: '/daemon.sock' });

const daemons = new Map();
const webclients = new Map();
app.use(express.json());
app.use(cookieParser());

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

app.use(express.static(path.join(__dirname, '../website/dist')));

const generateDaemonToken = (hwid) => {
    const payload = { type: 'daemon token', hwid: hwid }
    return jwt.sign(payload, process.env.JWT_SECRET);
}

const authenticateDaemonToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        if (payload.type !== 'daemon token') {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        req.hwid = payload.hwid;

        next();
    });
};

const authenticateToken = (req, res, next) => {
    const token = req.cookies.tunnl_session;

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        if (payload.type !== 'user token') {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        req.id = payload.id;

        next();
    });
}

const authenticateSocketToken = (socket, next) => {
    const [_, token] = socket.handshake.headers.cookie
        ?.split("; ")
        .find(row => row.startsWith("tunnl_session="))
        ?.split("=") || [];

    if (!token) return next(new Error('Invalid token'));

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return next(new Error('Invalid token'));

        if (payload.type !== 'user token') return next(new Error('Invalid token'));

        socket.userid = payload.id

        return next();
    });
}

const authenticateDaemon = async (req, res, next) => {
    try {
        const userid = req.id;
        const hwid = req.params.hwid;

        if (!hwid) {
            res.status(401).json({ message: "Unauthorized access to daemon" });
            return;
        }

        const response = await client.query(`
            SELECT * FROM devices WHERE user_id = $1
        `, [userid]);

        const exists = response.rows.find(r => r.id === hwid);

        if (!exists) {
            res.json({ message: "Unauthorized access to daemon" });
            return;
        }

        req.hwid = hwid;
        req.daemon = daemon(hwid);
        req.daemon.stopTunnel = () => stopTunnel(req.daemon, hwid);
        req.daemon.startTunnel = () => startTunnel(req.daemon, hwid);
        req.daemon.setDnsIpRange = (dnsIpRange) => setDnsIpRange(req.daemon, dnsIpRange);

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
}

const authenticateService = (req, res, next) => {
    try {
        const serviceid = req.params.serviceid;

        getService(serviceid)
            .then(service => {
                if (!service) return res.status(401).json({ message: 'Unauthorized' });
                if (service.userid !== req.id) return res.status(401).json({ message: 'Unauthorized' });
                req.service = service;
                next();
            });
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

const daemon = (hwid) => {
    const socketid = daemons.get(hwid);
    if (!socketid) return null;
    return daemonio.to(socketid);
}

const webclient = (userid) => {
    const socketids = webclients.get(userid);
    if (!socketids) return [];
    return socketids.map(id => webio.to(id));
}

const getDevice = async (id) => {
    const response = await client.query(`
        SELECT * FROM devices WHERE id = $1 
    `, [id]);

    if (response.rows.length === 0) return null;

    const d = response.rows[0];

    return {
        id: d.id,
        userid: d.user_id,
        lastLogin: d.last_login,
        createdAt: d.created_at,
        hostname: d.hostname,
        dnsIpRange: d.dns_ip_range,
        displayName: d.display_name,
        isDaemonOnline: d.is_daemon_online,
        isTunnelOnline: d.is_tunnel_online,
        isTunnelAutostart: d.is_tunnel_autostart
    }
}

const getService = async (id) => {
    const response = await client.query(`
        SELECT * FROM services WHERE id = $1
    `, [id]);

    if (response.rows.length === 0) return null;

    const s = response.rows[0];

    return {
        id: s.id,
        userid: s.user_id,
        deviceid: s.device_id,
        name: s.name,
        domain: s.domain,
        host: s.host,
        portRange: s.port_range,
        createdAt: s.created_at
    }
}

const getUser = async (id) => {
    try {
        let response = await client.query(`
        SELECT * FROM users WHERE id = $1
    `, [id]);

        if (response.rows.length === 0) return null;

        const dbuser = response.rows[0];

        response = await client.query(`
            SELECT * FROM devices WHERE user_id = $1
        `, [dbuser.id]);

        const dbdevices = response.rows;

        response = await client.query(`
            SELECT * FROM services WHERE user_id = $1
        `, [dbuser.id]);

        const dbservices = response.rows;

        response = await client.query(`
            SELECT * FROM communities WHERE owner_id = $1
        `, [dbuser.id]);

        const dbcommunities = response.rows;

        const user = {
            id: dbuser.id,
            email: dbuser.email,
            name: dbuser.name,
            displayName: dbuser.display_name,
            googleid: dbuser.google_id,
            picture: dbuser.picture,
            lastLogin: dbuser.last_login,
            createdAt: dbuser.created_at,
            devices: dbdevices.map(d => {
                return {
                    id: d.id,
                    lastLogin: d.last_login,
                    createdAt: d.created_at,
                    hostname: d.hostname,
                    dnsIpRange: d.dns_ip_range,
                    displayName: d.display_name,
                    isDaemonOnline: d.is_daemon_online,
                    isTunnelOnline: d.is_tunnel_online,
                    isTunnelAutostart: d.is_tunnel_autostart
                }
            }),
            services: dbservices.map(s => {
                return {
                    id: s.id,
                    deviceid: s.device_id,
                    name: s.name,
                    domain: s.domain,
                    host: s.host,
                    portRange: s.port_range,
                    createdAt: s.created_at,
                }
            }),
            communities: dbcommunities.map(c => {
                return {
                    id: c.id,
                    name: c.name,
                    createdAt: c.created_at,
                };
            })
        }

        return user;
    } catch (err) {
        return null;
    }
}

const startListener = async () => {
    try {
        await client.query('LISTEN user_updates')
        await client.query('LISTEN device_updates')
        await client.query('LISTEN service_updates')
        await client.query('LISTEN community_updates')
        client.on('notification', async msg => {
            const payload = JSON.parse(msg.payload);
            console.log(payload)
            const id = payload.user ?
                payload.user.id : payload.device ?
                    payload.device.user_id : payload.service ?
                        payload.service.user_id : payload.community ?
                            payload.community.owner_id : null;
            const user = await getUser(id);
            if (!user) return;
            const clients = webclients.get(id);
            if (!clients) return;
            for (let i = 0; i < clients.length; i++) {
                webio.to(clients[i]).emit('user:update', user);
            }
        });
    } catch (err) {
        console.error(err);
    }
}

const startTunnel = (daemon, hwid) => {
    return new Promise((resolve, reject) => {
        try {
            daemon.timeout(10000).emit('tunneler:start', async (err, response) => {
                if (err) reject();
                if (response.length === 0) reject();
                if (response[0].success)
                    await client.query('UPDATE devices SET is_tunnel_online = true WHERE id = $1', [hwid]);
                resolve();
            });
        } catch (err) {
            console.error(err);
            reject();
        }
    });
}

const stopTunnel = (daemon, hwid) => {
    return new Promise((resolve, reject) => {
        try {
            daemon.timeout(10000).emit('tunneler:stop', async (err, response) => {
                if (err) reject();
                if (response.length === 0) reject();
                if (response[0].success)
                    await client.query('UPDATE devices SET is_tunnel_online = false WHERE id = $1', [hwid]);
                resolve();
            });
        } catch (err) {
            console.error(err);
            reject();
        }
    });
}

const setDnsIpRange = (daemon, dnsIpRange) => {
    return new Promise((resolve, reject) => {
        try {
            daemon.timeout(10000).emit('tunneler:set:dns-ip-range', { dns_ip_range: dnsIpRange }, async (err, response) => {
                if (err) reject();
                if (response.length === 0) reject();
                resolve();
            });
        } catch (err) {
            console.error(err);
            reject();
        }
    });
}

app.get('/api/v1/user', authenticateToken, async (req, res) => {
    try {
        console.log('GET /api/v1/user');
        const user = await getUser(req.id);
        if (!user) return res.status(500).json({ message: 'An error occured' });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

const testDomain = (domain) => {
    return !/^[a-zA-Z][a-zA-Z0-9]+$/.test(domain)
}
const testPortRange = (portRange) => {
    if (portRange.includes(' ')) return false;
    const ports = portRange.split(/[;-]/);
    const filteredPorts = ports.filter(p => {
        const n = Number(p);
        return Number.isInteger(n) && n >= 0 && n <= 65535;
    });
    return ports.length === filteredPorts.length;
}

app.post('/api/v1/service/:hwid', authenticateToken, authenticateDaemon, async (req, res) => {
    try {
        console.log('POST /api/v1/service');
        const { name, domain, host, portRange } = req.body.data;

        const service = {
            userid: req.id,
            deviceid: req.hwid,
            name: name.trim(),
            domain: domain.trim().toLowerCase(),
            host: host.trim(),
            portRange: portRange.trim(),
        }

        if (!testDomain(service.domain)) throw new Error('Invalid domain');

        if (!testPortRange(service.portRange)) throw new Error('Invalid port range');

        await client.query(`
            INSERT INTO services (user_id, device_id, name, domain, host, port_range)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [service.userid, service.deviceid, service.name, service.domain, service.host, service.portRange]);

        res.status(201).json({ message: 'Successfully inserted service' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.post('/api/v1/auth/google/callback', async (req, res) => {
    try {
        console.log("POST /api/v1/auth/google");

        const { code } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: code,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub } = payload;

        const response = await axios.get(picture, { responseType: "arraybuffer" });

        fs.writeFileSync(`resources/${sub}.jpg`, response.data);

        await client.query("BEGIN");

        let result = await client.query(
            `SELECT * FROM users WHERE google_id = $1`,
            [sub]
        );

        let user;

        if (result.rows.length === 0) {
            const insertResult = await client.query(`
                INSERT INTO users (google_id, email, display_name, name, picture, last_login)
                VALUES ($1, $2, $3, $4, $5, NOW())
                RETURNING *
                `, [sub, email, name, name, `/resources/${sub}.jpg`]
            );
            user = insertResult.rows[0];
        } else {
            user = result.rows[0];
            await client.query(`
                UPDATE users
                SET last_login = NOW(), picture = $1
                WHERE id = $2
                `, [`/resources/${sub}.jpg`, user.id]
            );
        }

        await client.query("COMMIT");

        const data = { type: 'user token', id: user.id };

        const token = jwt.sign(data, process.env.JWT_SECRET);

        res.cookie("tunnl_session", token, {
            httpOnly: true,
            secure: process.env.IS_PROD === true,
            sameSite: 'strict',
            expires: new Date(Date.now() + 3600000 * 24 * 7),
        });

        res.status(201).json({ token: token });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.post('/api/v1/user/logout', async (req, res) => {
    try {
        console.log('POST /api/v1/user/logout')
        res.clearCookie('tunnl_session', {
            sameSite: 'Strict',
            path: '/'
        });
        res.status(201).json({ message: 'Sucessfully logged out' });
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "An error occured" });
    }
});

app.post('/api/v1/daemon', authenticateDaemonToken, async (req, res) => {
    try {
        console.log('POST /api/v1/daemon');

        const { userid, hostname } = req.body;
        const hwid = req.hwid;

        await client.query(`
            INSERT INTO devices (
                id,
                user_id,
                last_login,
                hostname,
                display_name,
                dns_ip_range,
                is_daemon_online,
                is_tunnel_online,
                is_tunnel_autostart
            )
            VALUES ($1, $2, NOW(), $3, $4, $5, $6, $7, $8)
        `, [hwid, userid, hostname, hostname, '203.0.113.0/24', true, false, false]);

        res.status(200).json({ message: 'Successfully authenticated the daemon' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.patch('/api/v1/daemon/:hwid/name', authenticateToken, authenticateDaemon, async (req, res) => {
    try {
        console.log('PATCH /api/v1/daemon/name');

        const { name } = req.body.data;
        console.log(name);

        await client.query('UPDATE devices SET display_name = $2 WHERE id = $1',
            [req.hwid, name]);

        res.status(200).json({ message: 'Successfully changed device name' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.patch('/api/v1/user/name', authenticateToken, async (req, res) => {
    try {
        console.log('PATCH /api/v1/user/name');

        const { name } = req.body.data;

        await client.query('UPDATE users SET display_name = $2 WHERE id = $1',
            [req.id, name]);

        res.status(200).json({ message: 'Successfully changed display name' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.delete('/api/v1/daemon/:hwid', authenticateToken, authenticateDaemon, async (req, res) => {
    try {
        console.log('DELETE /api/v1/daemon');

        await client.query('DELETE FROM devices WHERE id = $1',
            [req.hwid]);

        if (req.daemon) req.daemon.emit('tunneler:stop');

        res.status(200).json({ message: 'Successfully deleted daemon' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.delete('/api/v1/service/:serviceid', authenticateToken, authenticateService, async (req, res) => {
    try {
        console.log('DELETE /api/v1/service');

        await client.query(
            'DELETE FROM services WHERE id = $1 AND user_id = $2 RETURNING *',
            [req.service.id, req.id]
        );

        res.json({ message: 'Successfully deleted service' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.post('/api/v1/daemon/:hwid/start', authenticateToken, authenticateDaemon, async (req, res) => {
    try {
        console.log('POST /api/v1/daemon/start');
        await startTunnel(req.daemon, req.hwid);
        await req.daemon.startTunnel();
        res.json({ message: 'Successfully started tunnel' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.post('/api/v1/daemon/:hwid/stop', authenticateToken, authenticateDaemon, async (req, res) => {
    try {
        console.log('POST /api/v1/daemon/stop');
        await req.daemon.stopTunnel();
        res.json({ message: 'Successfully stopped tunnel' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.get('/api/v1/daemon/:hwid/status', authenticateToken, authenticateDaemon, async (req, res) => {
    try {
        console.log('GET /api/v1/daemon/status');
        req.daemon.timeout(10000).emit('tunneler:status', (err, response) => {
            if (err) throw new Error('Could not connect to daemon');
            if (response.length === 0) throw new Error('Could not connect to daemon');
            res.json(response[0]);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.patch('/api/v1/daemon/:hwid/autostart', authenticateToken, authenticateDaemon, async (req, res) => {
    try {
        console.log('GET /api/v1/daemon/status');
        const { value } = req.body.data;
        await client.query('UPDATE devices SET is_tunnel_autostart = $1 WHERE id = $2', [value, req.hwid])
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.patch('/api/v1/service/:serviceid', authenticateToken, authenticateService, async (req, res) => {
    try {
        console.log('PATCH /api/v1/service')
        const { name, domain, host, portRange, deviceid } = req.body.data;

        const s = {
            name: name ? name : req.service.name,
            domain: domain ? domain.toLowerCase() : req.service.domain,
            host: host ? host : req.service.host,
            portRange: portRange ? portRange : req.service.portRange,
            deviceid: deviceid ? deviceid : req.service.deviceid,
        }

        const device = await getDevice(s.deviceid);

        if (device.userid !== req.id) return res.status(401).json({ message: 'Unauthorized' });

        if (!testDomain(s.domain)) throw new Error('Invalid domain');
        if (!testPortRange(s.portRange)) throw new Error('Invalid portRange');

        const response = await client.query(`
            UPDATE services SET 
            name = $1,
            domain = $2,
            host = $3,
            port_range = $4,
            device_id = $5
            WHERE id = $6
        `, [s.name, s.domain, s.host, s.portRange, s.deviceid, req.service.id]);

        res.status(200).json({ message: 'Successfully updated service' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.get('/resources/:filename', (req, res) => {
    const filePath = path.join(__dirname, "/resources/", req.params.filename);
    res.sendFile(filePath);
});

app.post('/api/v1/community', authenticateToken, async (req, res) => {
    try {
        console.log('POST /api/v1/community');

        const { name } = req.body.data;

        await client.query('BEGIN');

        const response = await client.query(
            'INSERT INTO communities (name, owner_id) VALUES ($1, $2) RETURNING *',
            [name, req.id]
        );

        const community = response.rows[0];

        await client.query(
            'INSERT INTO members (user_id, community_id) VALUES ($1, $2)',
            [req.id, community.id]
        );

        await client.query('COMMIT');

        res.status(201).json({ message: 'Successfully inserted community' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

app.post('/api/v1/invite', authenticateToken, async (req, res) => {
    try {
        console.log('POST /api/v1/invite');

        const { communityid, isOneTimeUse, expires } = req.body.data;

        const response = await client.query(
            'INSERT INTO invites (community_id, is_one_time_use, expires) VALUES ($1, $2, $3) RETURNING *',
            [communityid, isOneTimeUse, expires]
        );

        res.status(201).json({ code: response.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

daemonio.on('connection', socket => {
    console.log('A daemon connected');

    socket.emit('register:request', async data => {
        if (!data.hwid) return;

        daemons.set(data.hwid, socket.id);

        try {
            client.query('UPDATE devices SET is_daemon_online = true, last_login = NOW() WHERE id = $1', [data.hwid]);
        } catch { }

        socket.emit('register:response', { token: generateDaemonToken(data.hwid) });

        const device = await getDevice(data.hwid);
        if (!device) return;
        const d = daemon(data.hwid);
        await setDnsIpRange(d, device.dnsIpRange);
        await startTunnel(d, data.hwid);
    });

    socket.on('disconnect', () => {
        const hwid = [...daemons.entries()].find(([_, value]) => value === socket.id)?.[0];

        if (!hwid) return;

        try {
            client.query('UPDATE devices SET is_daemon_online = false, is_tunnel_online = false WHERE id = $1', [hwid]);
        } catch (err) { }

        daemons.delete(hwid);
    });
});


webio.use(authenticateSocketToken);

webio.on('connection', socket => {
    console.log('A web client connected')

    const clients = webclients.get(socket.userid) ? webclients.get(socket.userid) : [];
    clients.push(socket.id);
    webclients.set(socket.userid, clients);

    socket.on('disconnect', () => {
        console.log('Disconnecting web client')
        const clients = webclients.get(socket.userid).filter(id => socket.id !== id);
        webclients.set(socket.userid, clients);
    });

    getUser().then(u => { if (u) socket.emit('user:update', u) });
});

startListener();

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'website', 'dist', 'index.html'));
});

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
