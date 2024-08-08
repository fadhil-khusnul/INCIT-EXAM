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


        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();

                done(null, user, accessToken);
            } else {

                done(null, 0, null);

            }
        } else {
            user = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName
            });
            await user.save();
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
    profileFields: ['id', 'displayName', 'emails']
}, async(accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });


        if (user) {
            if (!user.facebookId) {
                user.facebookId = profile.id;
                await user.save();

                done(null, user, accessToken);
            } else {

                done(null, 0, null);

            }
        } else {
            user = new User({
                facebookId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName
            });
            await user.save();
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