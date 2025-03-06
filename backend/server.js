const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');
const pg = require('pg');
const jwt = require('jsonwebtoken');

dotenv.config();

const PORT = process.env.PORT || 3123;

const app = express();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

app.get("/api/v1/hello", (req, res) => {
    console.log("GET /api/v1/hello");
    res.json({ message: "world" });
});

//app.get("*", (_, res) => {
//    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
//})

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }

        req.user = user;

        next();
    });
}

app.post("/api/v1/auth/google/callback", async (req, res) => {
    try {
        console.log("POST /api/v1/auth/google");

        const { code } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: code,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleID } = payload;

        await client.query("BEGIN");

        let result = await client.query(
            `SELECT * FROM users WHERE googleid = $1`,
            [googleID]
        );

        let user;

        if (result.rows.length === 0) {
            const insertResult = await client.query(`
                INSERT INTO users (googleID, email, displayName, pictureURL, lastLogin)
                VALUES ($1, $2, $3, $4, NOW())
                RETURNING *
                `, [googleID, email, name, picture]
            );
            user = insertResult.rows[0];
        } else {
            user = result.rows[0];
            await client.query(`
                UPDATE users
                SET lastLogin = NOW(), pictureURL = $1
                WHERE userID = $2
                `, [picture, user.userid]
            );
        }

        await client.query("COMMIT");

        const data = {
            email: email,
            pictureURL: picture,
            googleID: googleID,
            name: name,
            expires: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
        };

        const token = jwt.sign(data, process.env.JWT_SECRET);

        res.status(201).json({ token: token, email: email, pictureURL: picture });
    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(501).json({ message: "An error occured" });
    }
});

app.get("/api/v1/user/profile", authenticateToken, async (req, res) => {
    try {
        console.log("GET /api/v1/user/profile")
        let result = await client.query(`
            SELECT email, displayName, pictureURL FROM users WHERE email = $1
        `, [req.user.email]);

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const displayName = result.rows[0].displayname;
        const pictureURL = result.rows[0].pictureurl;

        result = await client.query(`
            SELECT d.deviceID, d.deviceName
            FROM devices d
            JOIN users u ON d.ownerID = u.userID
            WHERE u.email = $1;
        `, [req.user.email]);

        const devices = result.rows.map(elem => {
            return { id: elem.deviceid, name: elem.devicename }
        });

        result = await client.query(`
            SELECT s.domain, s.name, s.host, s.portRange, s.description, s.deviceID
            FROM services s
            JOIN users u ON s.userID = u.userID
            WHERE u.email = $1
        `, [req.user.email]);

        const services = result.rows;

        result = await client.query(`
            SELECT c.name, c.communityID, c.description 
            FROM communities c
            WHERE c.ownerID = (SELECT users.userID FROM users WHERE users.email = $1)
        `, [req.user.email]);

        const communities = result.rows;

        const user = {
            email: req.user.email,
            displayName: displayName,
            pictureURL: pictureURL,
            devices: devices,
            services: services.map(s => {
                return {
                    domain: s.domain,
                    name: s.name,
                    host: s.host,
                    portRange: s.portrange,
                    description: s.description,
                    deviceID: s.deviceid
                }
            }),
            communities: communities.map(c => {
                return {
                    name: c.name,
                    id: c.communityid,
                    description: c.description,
                    owner: true,
                }
            })
        }

        res.json({ user: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.post("/api/v1/user/device", authenticateToken, async (req, res) => {
    try {
        console.log("POST /api/v1/user/device");

        const { id, name } = req.body;
        const email = req.user.email;

        await client.query(`
            INSERT INTO devices (ownerID, deviceID, deviceName)
            VALUES (
                (SELECT userID FROM users WHERE email = $1),
                $2,
                $3
            )
        `, [email, id, name]);

        res.status(201).json({ message: "Successfully inserted device" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.post("/api/v1/user/service", authenticateToken, async (req, res) => {
    try {
        console.log("POST /api/v1/user/service");

        const { name, domain, host, portRange, deviceID } = req.body;
        const email = req.user.email;

        const response = await client.query(`
            INSERT INTO services (userID, domain, name, description, portRange, host, deviceID)
            VALUES (
                (SELECT userID FROM users WHERE email = $1),
                $2,
                $3,
                $4,
                $5,
                $6,
                $7
            ) RETURNING *
        `, [email, domain.trim(), name.trim(), "", portRange.trim(), host.trim(), deviceID.trim()]);

        const service = {
            domain: response.rows[0].domain,
            name: response.rows[0].name,
            description: response.rows[0].description,
            portRange: response.rows[0].portrange,
            host: response.rows[0].host,
            deviceID: response.rows[0].deviceid
        }

        console.log(service)

        res.status(201).json({ service: service })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.delete("/api/v1/user/service", authenticateToken, async (req, res) => {
    try {
        console.log("DELETE /api/v1/user/service");

        const { name } = req.body;
        const email = req.user.email;

        const response = await client.query(`
            DELETE FROM services
            WHERE (SELECT users.userID FROM users WHERE users.email = $1) = services.userID
            AND services.name = $2
            RETURNING *
        `, [email, name]);

        if (response.rows.length === 0) {
            res.status(404).status({ message: "Service not found" });
            return;
        }

        res.json({ message: "Successfully deleted the service" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.post("/api/v1/user/community", authenticateToken, async (req, res) => {
    try {
        console.log("POST /api/v1/user/community");

        const { name } = req.body;
        const email = req.user.email;

        const response = await client.query(`
            INSERT INTO communities (ownerID, name, description)
            VALUES (
                (SELECT userID FROM users where email = $1),
                $2,
                $3
            ) RETURNING *
        `, [email, name.trim(), ""]);

        if (response.rows.length === 0) {
            throw new Error("Error inserting community into the database");
        }

        const community = {
            id: response.rows[0].communityid,
            name: response.rows[0].name,
            description: response.rows[0].description,
            owner: true,
        }

        res.status(201).json({ community: community });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.delete("/api/v1/user/community", authenticateToken, async (req, res) => {
    try {
        console.log("DELETE /api/v1/user/community");

        const { name } = req.body;
        const email = req.user.email;

        await client.query(`
            DELETE FROM communities
            WHERE ownerID = (SELECT userID FROM users WHERE email = $1)
            AND communities.name = $2
        `, [email, name]);

        res.json({ message: "Successfully deleted community" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
