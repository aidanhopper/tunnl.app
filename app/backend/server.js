import express from "express";
import session from "express-session";
import axios from 'axios';
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

app.get("/api/v1/hello", (req, res) => {
    console.log("/api/v1/hello");
    res.json({ message: "world!" });
});


app.listen(process.env.PORT, () => console.log("Server running on", process.env.PORT));
