// TODO Lock this API behind an API key stored in the database

import dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';

dotenv.config();

const app = express();

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

app.use(express.json());

app.post("/api/v1/user/:email", async (req, res) => {
    try {
        const email = req.params.email;

        const checkResult = await client.query(
            "SELECT * FROM users WHERE users.email = $1",
            [email]
        );

        if (checkResult.rows.length !== 0) {
            res.status(403).json({ message: "User already exists" });
            return;
        }

        const insertResult = await client.query(
            "INSERT INTO users(email, hsUserID) VALUES($1, $2) RETURNING *",
            [email, `${Math.floor(Math.random() * 1000000)}`])

        res.status(201).json(insertResult.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.get("/api/v1/user/:email", async (req, res) => {
    try {
        const email = req.params.email;

        const result = await client.query(
            `
            WITH outgoing AS (
                SELECT 
                    u.email AS email,  -- Renaming user_email to email
                    ARRAY_AGG(DISTINCT d.ip) AS devices,  -- Renaming device_ips to devices
                    COALESCE(
                        JSONB_AGG(
                            DISTINCT JSONB_BUILD_OBJECT(
                                'email', cu.email,
                                'ip', ed.ip
                            )
                        ) FILTER (WHERE ed.ip IS NOT NULL), 
                        '[]'::JSONB
                    ) AS outgoing_edges
                FROM users u
                LEFT JOIN devices d ON u.userID = d.userID
                LEFT JOIN edges e ON u.userID = e.userID
                LEFT JOIN devices ed ON e.deviceID = ed.deviceID
                LEFT JOIN users cu ON ed.userID = cu.userID
                WHERE u.email = $1
                GROUP BY u.email
            ),
            incoming AS (
                SELECT 
                    u.email AS email,  -- Renaming user_email to email
                    ARRAY_AGG(DISTINCT d.ip) AS devices,  -- Renaming device_ips to devices
                    COALESCE(
                        JSONB_AGG(
                            DISTINCT JSONB_BUILD_OBJECT(
                                'email', cu.email,  -- The email of the user adding the edge
                                'ip', ed.ip
                            )
                        ) FILTER (WHERE ed.ip IS NOT NULL), 
                        '[]'::JSONB
                    ) AS incoming_edges
                FROM users u
                LEFT JOIN devices d ON u.userID = d.userID
                LEFT JOIN edges e ON d.deviceID = e.deviceID  -- The current user's device is the target
                LEFT JOIN devices ed ON e.deviceID = ed.deviceID  -- The devices of the other users
                LEFT JOIN users cu ON e.userID = cu.userID  -- The user adding the edge to the current user's device
                WHERE u.email = $1
                GROUP BY u.email
            )
            SELECT 
                o.email,
                o.devices,
                o.outgoing_edges,
                i.incoming_edges
            FROM outgoing o
            LEFT JOIN incoming i ON o.email = i.email;
            `,
            [email]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "User does not exist" });
            return;
        }

        // TODO Change the query to make sure that if condition is true it
        // returns an empty list
        const ret = result.rows[0];
        if (ret.devices[0] === null) {
            ret.devices = [];
        }

        res.json(ret);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }

});

app.delete("/api/v1/user/:email", async (req, res) => {
    try {
        const email = req.params.email;

        const result = await client.query(
            "DELETE FROM users WHERE users.email = $1 RETURNING *",
            [email]
        );

        if (result.rowCount === 1) {
            res.json({ message: "Successfully deleted user" });
            return;
        }

        res.status(400).json({ message: "User does not exist" })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.get("/api/v1/user", async (req, res) => {
    try {
        const result = await client.query(
            `
            WITH outgoing AS (
                SELECT 
                    u.email AS email,  -- Renaming user_email to email
                    ARRAY_AGG(DISTINCT d.ip) AS devices,  -- Renaming device_ips to devices
                    COALESCE(
                        JSONB_AGG(
                            DISTINCT JSONB_BUILD_OBJECT(
                                'email', cu.email,
                                'ip', ed.ip
                            )
                        ) FILTER (WHERE ed.ip IS NOT NULL), 
                        '[]'::JSONB
                    ) AS outgoing_edges
                FROM users u
                LEFT JOIN devices d ON u.userID = d.userID
                LEFT JOIN edges e ON u.userID = e.userID
                LEFT JOIN devices ed ON e.deviceID = ed.deviceID
                LEFT JOIN users cu ON ed.userID = cu.userID
                GROUP BY u.email
            ),
            incoming AS (
                SELECT 
                    u.email AS email,  -- Renaming user_email to email
                    ARRAY_AGG(DISTINCT d.ip) AS devices,  -- Renaming device_ips to devices
                    COALESCE(
                        JSONB_AGG(
                            DISTINCT JSONB_BUILD_OBJECT(
                                'email', cu.email,  -- The email of the user adding the edge
                                'ip', ed.ip
                            )
                        ) FILTER (WHERE ed.ip IS NOT NULL), 
                        '[]'::JSONB
                    ) AS incoming_edges
                FROM users u
                LEFT JOIN devices d ON u.userID = d.userID
                LEFT JOIN edges e ON d.deviceID = e.deviceID  -- The current user's device is the target
                LEFT JOIN devices ed ON e.deviceID = ed.deviceID  -- The devices of the other users
                LEFT JOIN users cu ON e.userID = cu.userID  -- The user adding the edge to the current user's device
                GROUP BY u.email
            )
            SELECT 
                o.email,
                o.devices,
                o.outgoing_edges,
                i.incoming_edges
            FROM outgoing o
            LEFT JOIN incoming i ON o.email = i.email;
            `
        );

        const ret = result.rows;

        // TODO Change the query to make sure that if condition is true it
        // returns an empty list for every user
        res.json(ret.map(u => {
            if (u.devices[0] === null) {
                u.devices = [];
            }
            return u;
        }));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error has occured" });
    }
});

app.get("/api/v1/device/:email", async (req, res) => {
    try {
        const email = req.params.email;

        const result = await client.query(
            "SELECT d.* FROM devices d \
             JOIN users u ON d.userId = u.userId \
             WHERE u.email = $1",
            [email]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error has occured" });
    }
});

app.post("/api/v1/device/:email/:key", async (req, res) => {
    try {
        const email = req.params.email;
        const key = req.params.key;
        const hsMachineID = `${Math.floor(Math.random() * 1000000)}`;

        const rand = () => {
            return Math.floor(Math.random() * 255);
        }

        const ip = `100.${rand()}.${rand()}.${rand()}`;

        const result = await client.query(
            `INSERT INTO devices (userid, hsDeviceID, ip)
             VALUES (
                 (SELECT userid FROM users WHERE email = $1),
                 $2,
                 $3
             ) RETURNING *`,
            [email, hsMachineID, ip]
        );

        res.status(201).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error has occured" });
    }
});

app.delete("/api/v1/device/:ip", async (req, res) => {
    try {
        const ip = req.params.ip;

        const result = await client.query(
            `DELETE FROM devices WHERE devices.ip = $1`, [ip]
        );

        if (result.rowCount === 1) {
            res.json({ message: "Successfully deleted device" });
            return;
        }

        res.status(400).json({ message: "Device does not exist" })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error has occured" });
    }
});

app.post("/api/v1/edge/:email/:ip", async (req, res) => {
    try {
        const email = req.params.email;
        const ip = req.params.ip;

        const result = await client.query(
            `INSERT INTO edges(userID, deviceID)
             VALUES (
                (SELECT userID FROM users WHERE email = $1),
                (SELECT deviceID FROM devices WHERE ip = $2)
             ) RETURNING *`, [email, ip]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error has occured" });
    }
});

app.delete("/api/v1/edge/:email/:ip", async (req, res) => {
    try {
        const email = req.params.email;
        const ip = req.params.ip;

        const result = await client.query(
            `DELETE FROM edges
             WHERE userID = (SELECT userID FROM users WHERE email = $1)
             AND deviceID = (SELECT deviceID FROM devices WHERE ip = $2)
             RETURNING *`, [email, ip]
        );

        if (result.rowCount !== 1) {
            res.status(404).json({ message: "Edge does not exist" });
            return;
        }

        res.json({ message: "Successfully deleted edge" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error has occured" });
    }
});

app.listen(process.env.PORT, () => console.log("Server running on", process.env.PORT));
