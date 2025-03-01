const dotenv = require('dotenv');
const express = require('express');
const path = require('path');

dotenv.config();

const PORT = process.env.PORT || 3123;

const app = express();

app.post("/api/v1/auth/google/:code", async (req, res) => {
    try {
        console.log("/api/v1/auth/google");
        const code = req.params.code;

        const googleApiResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
                grant_type: "authorization_code",
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_SECRET_ID,
                redirect_uri: "https://tunnl.app/login",
            })
        );

        const access_token = googleApiResponse.data.access_token;
        const refresh_token = googleApiResponse.data.refresh_token;
        const expires_in = googleApiResponse.data.expires_in;

        res.status(201).message(googleApiResponse.data);
    } catch (err) {
        console.error(err);
        res.status(501).json({ message: "An error occured" });
    }
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
})

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
