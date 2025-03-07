const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const PORT = process.env.PORT || 3123;

const app = express();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

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

//app.use(express.static(path.join(__dirname, '../frontend/dist')));

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

        if (payload.type !== 'user token') {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        req.id = payload.id;

        next();
    });
}

app.get('/api/v1/user', authenticateToken, async (req, res) => {
    try {
        const id = req.id;

        const response = await client.query(`
            SELECT * FROM users WHERE id = $1
        `, [id]);

        if (response.rows.length === 0) {
            res.status(500).json({ message: 'An error occured' });
            return;
        }

        const dbuser = response.rows[0];

        const user = {
            id: dbuser.id,
            email: dbuser.email,
            name: dbuser.name,
            displayName: dbuser.display_name,
            googleid: dbuser.google_id,
            picture: dbuser.picture,
            lastLogin: dbuser.last_login,
            createdAt: dbuser.created_at,
        }

        res.json(user);
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
                `, [sub, email, name, name, picture]
            );
            user = insertResult.rows[0];
        } else {
            user = result.rows[0];
            await client.query(`
                UPDATE users
                SET last_login = NOW(), picture = $1
                WHERE id = $2
                `, [picture, user.id]
            );
        }

        await client.query("COMMIT");

        const data = { type: 'user token', id: user.id };

        const token = jwt.sign(data, process.env.JWT_SECRET);

        res.status(201).json({ token: token });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(501).json({ message: "An error occured" });
    }
});

app.post('/api/v1/daemon/user', authenticateDaemonToken, async (req, res) => {
    try {
        console.log('POST /api/v1/daemon/user');

        const { userid } = req.body;
        const hwid = req.hwid;

        await client.query(`
            INSERT INTO devices (id, user_id, last_login)
            VALUES ($1, $2, NOW())
        `, [hwid, userid]);

        res.status(200).json({ message: 'Successfully authenticated user with daemon' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occured' });
    }
});

io.on('connection', socket => {
    console.log('a user connected');

    socket.on('register:request', data => {
        socket.emit('register:response', {
            token: generateDaemonToken(data.hwid)
        });

        socket.emit(`${data.hwid}`, {
            message: 'This is a message from hwid'
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
