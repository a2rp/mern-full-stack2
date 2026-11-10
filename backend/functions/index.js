require("dotenv").config();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const slowDown = require("express-slow-down");
const functions = require("firebase-functions");
const mongoose = require("mongoose");
const adminRoutes = require("./src/routes/admin.routes");
const userRoutes = require("./src/routes/user.routes");

const app = express();
const configuredOrigins = process.env.CLIENT_ORIGIN
    || (process.env.NODE_ENV === "production" ? "https://gurukul-task.web.app" : "http://localhost:3000,http://127.0.0.1:3000");
const allowedOrigins = configuredOrigins.split(",").map((origin) => origin.trim().replace(/\/+$/, "")).filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin not allowed by CORS"));
    },
    optionsSuccessStatus: 204,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
}));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(slowDown({ windowMs: 15 * 60 * 1000, delayAfter: 20, delayMs: 500 }));

app.get("/v1/health", (_req, res) => res.json({ success: true }));

let databaseConnection;
const connectDatabase = () => {
    if (mongoose.connection.readyState === 1) return Promise.resolve();
    if (mongoose.connection.readyState === 0) databaseConnection = null;
    if (!databaseConnection) {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
        if (!mongoUri) return Promise.reject(new Error("MONGODB_URI is not configured."));
        databaseConnection = mongoose.connect(mongoUri)
            .then(() => console.log("MongoDB connected."))
            .catch((error) => {
                databaseConnection = null;
                throw error;
            });
    }
    return databaseConnection;
};
mongoose.connection.on("disconnected", () => { databaseConnection = null; });

app.use("/v1", async (_req, res, next) => {
    try {
        await connectDatabase();
        return next();
    } catch (error) {
        console.error("MongoDB connection unavailable:", error.name);
        return res.status(503).json({ success: false, message: "The service is temporarily unavailable." });
    }
});

app.use("/v1/admin", adminRoutes);
app.use("/v1/user", userRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));
app.use((error, _req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === "entity.parse.failed") return res.status(400).json({ success: false, message: "Request body must contain valid JSON." });
    if (error.type === "entity.too.large") return res.status(413).json({ success: false, message: "Request body is too large." });
    if (error.message === "Origin not allowed by CORS") return res.status(403).json({ success: false, message: "This origin is not allowed." });
    console.error("Request failed:", error.name);
    return res.status(500).json({ success: false, message: "Unable to process this request right now." });
});

exports.api = functions.region("asia-south1").https.onRequest(app);
