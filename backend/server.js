import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();

app.use(express.json());

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

const users = [{ email: "aidanhop1@gmail.com", password: "password" }];

app.post("/api/v1/login", async (req, res) => {
    console.log("POST /api/v1/login");

    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid user" });
    }

    req.session.user = { email };
    res.json({ message: "Logged in successfully", user: req.session.user });
});

app.post("/api/v1/register", async (req, res) => {
    console.log("POST /api/v1/register");

    const { email, password } = req.body;

    const exists =
        users.find(u => u.email === email || u.password === password) !== undefined;

    if (exists) {
        return res.status(401).json({ message: "User already exists" });
    }

    const data = { email: email, password: password }
    users.push(data);

    req.session.user = { email };
    res.status(201).json({ message: "Successfully created user", user: data });
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

app.listen(process.env.PORT, () => console.log("Server running on", process.env.PORT));
