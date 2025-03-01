const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const axios = require('axios');

dotenv.config();

const PORT = process.env.PORT || 3123;

const app = express();

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
})

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
