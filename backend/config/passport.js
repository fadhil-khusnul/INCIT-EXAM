// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');
const Token = require('../models/Token');
const { now } = require('mongoose');
const { NOW } = require('sequelize');
const jwt = require('jsonwebtoken');

dotenv.config();

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: '/api/auth/google/callback',
//     passReqToCallback: true,
//     profileFields: ['id', 'displayName', 'emails', 'photos']

// }, async(req, accessToken, refreshToken, profile, done) => {
//     try {



//         let user = await User.findOne({ where: { email: profile.emails[0].value } });

//         if (user) {
//             return done(null, 0, { message: 'Email is already registered' })

//         } else {
//             user = await User.create({
//                 googleId: profile.id,
//                 email: profile.emails[0].value,
//                 name: profile.displayName,
//                 profilePic: profile.photos[0].value,
//             });

//             let token = await Token.create({
//                 userId: user.id,
//                 token: accessToken,
//                 createAt: Date.now(),
//                 updateAt: Date.now(),

//             })
//             return done(null, user, accessToken, info);
//         }
//     } catch (err) {
//         return done(err, null, null);
//     }
// }));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:5000/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'photos'] // Specify the fields you want from Facebook profile
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value;
            const name = profile.displayName;
            const profilePic = profile.photos[0].value;
            const lastLoginAt = Date.now();
            
            
            let user = await User.findOne({ where: { email } });
            // console.log(lastLoginAt);

            if (!user) {
                user = await User.create({
                    facebookId: profile.id,
                    email,
                    name,
                    profilePic,
                    lastLoginAt,
                });
            } else {
                user.lastLoginAt = Date.now();

                user.loginCount += 1;
                await user.save();
            }

            const payload = { id: user.id, name: user.name };
            const secret = process.env.JWT_SECRET;
            const token = jwt.sign(payload, secret);            
            return done(null, token);
        } catch (err) {
            return done(err, false);
        }
    }
));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});