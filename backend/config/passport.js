const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');
const Token = require('../models/Token');
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, async(accessToken, refreshToken, profile, done) => {
    try {



        let user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
            done(null, 0, accessToken)

        } else {
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                profilePic: profile.photos[0].value,
            });

            let token = await Token.create({
                userId: user.id,
                token: accessToken,
                createAt: Date.now(),
                updateAt: Date.now(),

            })
            done(null, user, accessToken);
        }
    } catch (err) {
        done(err, null, null);
    }
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos']
}, async(accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (user) {
            done(null, 0, accessToken);

        } else {
            user = await User.create({
                facebookId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                profilePic: profile.photos[0].value,
            });

            let token = await Token.create({
                userId: user.id,
                token: accessToken,
                createAt: Date.now(),
                updateAt: Date.now(),

            })
            done(null, user, accessToken);
        }
    } catch (err) {
        done(err, null, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});