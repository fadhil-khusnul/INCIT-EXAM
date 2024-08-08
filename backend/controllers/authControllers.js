const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const passport = require('passport');


exports.signup = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = new User({ email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '90d' });
        await new Token({ userId: user._id, token }).save();

        await sendVerificationEmail(user, req);
        res.status(201).json({ message: 'User registered, please verify your email' });
    } catch (err) {
        next(err)
    }
}

exports.validateSignup = () => [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/)
    .withMessage('Password must be at least 8 characters long, contain one upper case, one lower case, one digit, and one special character'),
    check('passwordconfirm')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
];

const sendVerificationEmail = async(user, req) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const url = `${req.protocol}://${req.get('host')}/api/auth/verify/${token}`;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        debug: true,
        logger: true
    });

    await transporter.sendMail({
        to: user.email,
        subject: 'Verify your email',
        html: `<h3>Click the link to verify your email: <a href="${url}">${url}</a></h3>`,
    });
};

exports.verifyToken = async(req, res, next) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.isVerified = true;
        await user.save();

        res.redirect('/dashboard');
    } catch (err) {
        next(err)
    }
}

// Google OAuth Sign-Up
exports.googleSignup = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = async(req, res, next) => {
    passport.authenticate('google', async(err, user, accessToken) => {

        if (err) {
            return res.status(400).json({ error: err });
        }

        if (!user) {
            return res.status(400).json({ message: 'Email and Google Account is Already Exists' });
        }


        try {
            let tokenUpdate = await Token.findOne({ userId: user._id });

            if (!tokenUpdate) {
                tokenUpdate = new Token({ userId: user._id, token: accessToken, createdAt: new Date(), updateAt: new Date() });
            } else {
                tokenUpdate.token = accessToken;
                tokenUpdate.updateAt = new Date();
            }
            await tokenUpdate.save();
            return res.redirect('/dashboard');
        } catch (error) {
            console.error('Error saving token:', error);
            return next(error);
        }
    })(req, res, next);
};

// Facebook OAuth Sign-Up
exports.facebookSignup = passport.authenticate('facebook', { scope: ['email'] });

exports.facebookCallback = (req, res, next) => {
    passport.authenticate('facebook', async(err, user, accessToken) => {

        if (err) {
            return res.status(400).json({ error: err });
        }

        if (!user) {
            return res.status(400).json({ message: 'Email and Facebook Account is Already Exists' });
        }

        try {
            let tokenUpdate = await Token.findOne({ userId: user._id });

            if (!tokenUpdate) {
                tokenUpdate = new Token({ userId: user._id, token: accessToken, createdAt: new Date(), updateAt: new Date() });
            } else {
                tokenUpdate.token = accessToken;
                tokenUpdate.updateAt = new Date();
            }
            await tokenUpdate.save();
            return res.redirect('/dashboard');
        } catch (error) {
            console.error('Error saving token:', error);
            return next(error);
        }


    })(req, res, next);
};

exports.logout = (req, res) => {

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.redirect('/login');
};