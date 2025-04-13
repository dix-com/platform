const express = require("express");
const passport = require("./config/passport");
const sessionMiddleware = require("./config/session");
const rateLimitHandler = require("./middlewares/rateLimitHandler");
const loggerMiddleware = require("./middlewares/loggerMiddleware");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes/index");

const rateLimit = require("express-rate-limit");

const helmet = require("helmet");

const mongoSanitize = require('express-mongo-sanitize');

const cors = require("cors");

const cookieParser = require("cookie-parser");


const app = express();

app.use(loggerMiddleware);

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN || "http:
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
        credentials: true,
    })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
}));

const limiter = rateLimit({
    max: 3000,
    windowMs: 60 * 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler
});

app.use(limiter);

app.use(mongoSanitize());

app.use(routes);

app.use(errorHandler);

module.exports = app;