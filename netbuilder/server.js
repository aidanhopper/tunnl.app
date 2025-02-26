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

const managementAPI = `${process.env.ZITI_CONTROLLER_URL}/edge/management/v1`;
const apiToken = "268e6fe7-7ab2-40f7-aa16-e1993d101b08";

client.connect()
    .then(() => console.log("Connected to PostgreSQL DB"))
    .catch(err => console.error("Error", err.stack));

app.use(express.json());

app.post("/api/v1/token", async (req, res) => {
    try {
        const url = `${managementAPI}/authenticate?method=password`;
        const response = await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: process.env.ZITI_ADMIN_USERNAME,
                    password: process.env.ZITI_ADMIN_PASSWORD,
                })
            }
        );
        const token = (await response.json()).data.token;
        res.status(201).json({ token: token });
    } catch (err) {
        console.error(err);
        res.status(501).json({ message: "An error occured" });
    }
});

app.post("/api/v1/device/:id", async (req, res) => {
    try {
        const name = req.params.name;

        const postIdentityURL = `${managementAPI}/identities`;
        const postIdentityResponse = await fetch(postIdentityURL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "zt-session": apiToken,
                },
                body: JSON.stringify({
                    name: name,
                    isAdmin: false,
                    type: "Device",
                    roleAttributes: [],
                    enrollment: {
                        ott: true
                    },
                }),
            }
        );
        if (postIdentityResponse.status !== 200) {
            console.error(await postIdentityResponse.json());
            throw new Error("Error posting identity");
        }

        const id = (await postIdentityResponse.json()).data.id;

        const getEnrollmentTokenURL = `${managementAPI}/identities/${id}/enrollments`;

        const getEnrollmentJwtResponse = await fetch(getEnrollmentTokenURL,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "zt-session": apiToken,
                },
            }
        );

        if (getEnrollmentJwtResponse.status !== 200) {
            console.error(await getEnrollmentJwtResponse.json());
            throw new Error("Error getting enrollment jwt");
        }

        const jwt = (await getEnrollmentJwtResponse.json()).data[0].jwt;

        res.json({ jwt: jwt });
    } catch (err) {
        console.log(err);
        res.status(501).json({ message: "An error occured" });
    }
});

app.listen(process.env.PORT, () => console.log("Server running on", process.env.PORT))
