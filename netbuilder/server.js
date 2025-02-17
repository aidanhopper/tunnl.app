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
            "SELECT * FROM users WHERE users.email = $1",
            [email]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ message: "User does not exist" });
            return;
        }

        res.json(result.rows[0]);
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
            "SELECT * FROM users"
        );
        res.json(result.rows);
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

        res.json(result.rows);
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

app.listen(process.env.PORT, () => console.log("Server running on", process.env.PORT));
