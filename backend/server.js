import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcryptjs";

dotenv.config();

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

const app = express();
app.use(express.json());

const saltRounds = 10;

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            httpOnly: true,
        },
    })
);

app.post("/api/v1/login", async (req, res) => {
    try {
        console.log("POST /api/v1/login");

        const { email, password } = req.body;

        const result = await client.query(
            "SELECT hashedPassword FROM users WHERE email = $1",
            [email]
        )

        if (result.rows.length !== 1) {
            res.status(404).json({ message: "User does not exist" });
            return;
        }

        const hashedPassword = result.rows[0].hashedpassword;

        bcrypt.compare(password, hashedPassword, (err, r) => {
            if (err) {
                throw new Exception(err);
            }

            if (r) {
                req.session.user = { email };
                res.status(200).json({ message: "Logged in successfully", user: req.session.user });
                return;
            }

            res.status(401).json({ message: "Incorrect password" });
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.post("/api/v1/register", async (req, res) => {
    try {
        console.log("POST /api/v1/register");

        const { email, password } = req.body;

        const hash = await bcrypt.hash(password, saltRounds);

        const insertUserResponse = await client.query(
            `
                    INSERT INTO users(email, hashedPassword)
                    VALUES (
                        $1,
                        $2
                    ) RETURNING *
                    `, [email, hash]
        );

        if (insertUserResponse.rows === 0) {
            throw new Error("Inserting in DB failed");
        }

        const addUserToMeshNetResponse = await fetch(
            `${process.env.API_URL}/api/v1/user/${email}`,
            {
                method: "POST",
                headers:
                {
                    "Authorization": "Bearer API_KEY_SHOULD_BE_HERE"
                }
            }
        );

        if (addUserToMeshNetResponse.status != 201) {
            client.query(`
                        DELETE FROM users WHERE email = $1
                    `, [email]);
            throw new Error("Failed to add user to MeshNet");
        }

        req.session.user = { email };
        res.status(201).json({ message: "Successfully created user", user: email });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.get("/api/v1/session", (req, res) => {
    console.log("GET /api/v1/session");
    if (!req.session.user) {
        return res.status(401).json({ message: "Not logged in" });
    }
    res.json({ user: req.session.user });
});

app.post("/api/v1/logout", (req, res) => {
    console.log("POST /api/v1/logout");
    req.session.destroy(() => {
        res.json({ message: "Logged out" });
    });
});

app.get("/api/v1/user", async (req, res) => {
    try {
        console.log(`GET /api/v1/user`);
        if (!req.session.user) {
            res.status(401).json({ message: "Not logged in" });
            return;
        }

        const email = req.session.user.email;

        const response = await fetch(`${process.env.API_URL}/api/v1/user/${email}`);
        res.json(await response.json());
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.post("/api/v1/device/:key", async (req, res) => {
    try {
        console.log("POST /api/v1/device");
        if (!req.session.user) {
            res.status(401).json({ message: "Not logged in" });
            return;
        }

        const email = req.session.user.email;
        const key = req.params.key;

        const response = await fetch(
            `${process.env.API_URL}/api/v1/device/${email}/${key}`,
            {
                method: "POST"
            }
        );

        if (response.status !== 201) {
            res.status(401).json({ message: "Invalid key" });
            return;
        }

        res.status(201).json({ message: "Successfully created device" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.delete("/api/v1/device/:ip", async (req, res) => {
    try {
        console.log("DELETE /api/v1/device");
        if (!req.session.user) {
            res.status(401).json({ message: "Not logged in" });
            return;
        }

        const ip = req.params.ip;
        const email = req.session.user.email;

        const response = await fetch(
            `${process.env.API_URL}/api/v1/device/${ip}`,
            {
                method: "DELETE"
            }
        );

        if (response.status !== 200) {
            res.status(401).json({ message: "Invalid ip" });
            return;
        }

        res.status(200).json({ message: `Successfully deleted ${ip}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occured" });
    }
});

app.listen(process.env.PORT, () => console.log("Server running on", process.env.PORT));
