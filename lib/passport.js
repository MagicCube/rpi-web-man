const LocalStrategy = require("passport-local").Strategy;
const md5 = require("md5");
const bcrypt = require('bcrypt');
const passport = require("passport");
const dotenv = require('dotenv');
dotenv.config();

passport.use("local", new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    (username, password, done) => {
        const serverUsername = (process.env.USERNAME && process.env.USERNAME !== '') ?
            process.env.USERNAME : 'admin';
        const serverPassword = (process.env.PASSWORD && process.env.PASSWORD !== '') ?
            process.env.PASSWORD : '$2y$10$BiQ8hbUWvjnu4Yi59i4e/u0LKMcoOzAn/5oeZjh5JrzekAeVn4oX.';
        
        if (!process.env.PASSWORD) password = md5(password)
        if (username === serverUsername && bcrypt.compareSync(password, serverPassword))
        {
            return done(null, {
                id: "admin"
            });
        }
        else
        {
            return done(null, false);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, {
        id
    });
});

module.exports = passport;
