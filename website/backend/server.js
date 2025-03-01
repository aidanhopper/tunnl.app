const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');

dotenv.config();

const PORT = process.env.PORT || 3123;

const app = express();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
})

app.post("/api/v1/auth/google/callback", async (req, res) => {
    try {
        console.log("/api/v1/auth/google");

        const { code } = req.body;

        const ticket = await googleClient.verifyIdToken({
            idToken: code,
            audience: process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload();
        const { email, name, picture, sub } = payload;

        console.log(payload);

        res.status(201).message(payload);
    } catch (err) {
        console.error(err);
        res.status(501).json({ message: "An error occured" });
    }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
