require("dotenv").config();

const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const slowDown = require("express-slow-down");


const app = express();

const adminRoutes = require("./src/routes/admin.routes");
const userRoutes = require("./src/routes/user.routes");

// middlewares
const whitelist = [ // remove localhost from development
    "https://gurukul-task.web.app",
    "http://localhost",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://localhost:3000"
];
const corsoptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) { // remove !origin from development
            // if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionSuccessStatus: 200, // // some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
};
app.use(cors(corsoptions));
// app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});



// app.enable("trust proxy"); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 20, // allow 20 requests per 15 minutes, then...
    delayMs: 500 // begin adding 500ms of delay per request above 100:
    // request # 101 is delayed by  500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 1500ms
    // etc.
});
app.use(speedLimiter);


// routes
app.use("/v1/admin", adminRoutes);
app.use("/v1/user", userRoutes);





// connect to mongodb and then start server
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("MongoDB is  connected successfully");
}).catch((err) => {
    console.error(err);
});

exports.api = functions.region("asia-south1").https.onRequest(app);
