const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const session = require("express-session");
const FileStore = require('session-file-store')(session);
const dotenv = require('dotenv');
var crypto = require("crypto");

/**
 * Setup express app
 */
const app = express();
const passport = require("./passport");
dotenv.config();

/**
 * Parsers
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: (process.env.COOKIE_SECRET && process.env.COOKIE_SECRET !== '') ?
        process.env.COOKIE_SECRET : crypto.randomBytes(40).toString('hex'),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 * 100 },
    store: new FileStore({
        path: "./.sessions"
    })
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Gate Keeper
 */
app.post('/login',
    passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login.html?error=true"
    })
);
app.use((req, res, next) => {
    if (req.path === "/login" || req.path === "/login.html" || req.path.startsWith("/assets/") || req.isAuthenticated())
    {
        next();
    }
    else
    {
        res.redirect("/login.html")
    }
});

/**
 * Statics
 */
app.use("/socket.io", express.static(path.join(__dirname, "../node_modules/socket.io-client")));

/**
 * Routers
 */
app.use(express.static(path.join(__dirname, "../public")));
app.use("/", require("./route"));

module.exports = app;
