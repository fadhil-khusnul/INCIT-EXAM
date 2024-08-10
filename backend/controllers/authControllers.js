const crypto = require('crypto');
const { Sequelize } = require('sequelize');

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');


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

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, profilePic } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });


        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = await User.create({ email, password, name, profilePic });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '90d' });
        await Token.create({ userId: user.id, token });

        await sendVerificationEmail(user, req);
        res.status(201).json({ message: 'User registered, please verify your email' });
    } catch (err) {
        next(err)
    }
}


const sendVerificationEmail = async (user, req) => {
    const randomString = crypto.randomBytes(16).toString('hex');
    const token = jwt.sign({ id: user.id, rand: randomString }, process.env.JWT_SECRET, { expiresIn: '1d' });

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

exports.verifyToken = async (req, res, next) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
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
exports.googleSignup = passport.authenticate('google', { scope: ['email'] });

exports.googleCallback = async (req, res, next) => {
    passport.authenticate('google', {
        prompt: 'select_account',
        successRedirect: `${process.env.CLIENT_URL}/dashboard`,
        failureRedirect: "/login/failed",
        session: false
    },
        async (err, user, info) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }

            if (!user) {
                return res.redirect(`${process.env.CLIENT_URL}/signup?error=${encodeURIComponent(info.message)}`);
            }

            try {

                let tokenUpdate = await Token.findOne({ where: { userId: user.id } });

                if (!tokenUpdate) {
                    tokenUpdate = await Token.create({
                        userId: user.id,
                        token: accessToken,
                        createdAt: Date.now(),
                        updateAt: Date.now()
                    });
                } else {
                    tokenUpdate.token = accessToken;
                    tokenUpdate.updateAt = Date.now();
                    await tokenUpdate.save();
                }

                res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });

                return res.redirect(process.env.CLIENT_URL);

            } catch (error) {
                console.error('Error saving token:', error);
                return next(error);
            }
        })(req, res, next);
};


// Facebook OAuth Sign-Up
exports.facebookSignup = passport.authenticate('facebook', { scope: ['email'] });

exports.facebookCallback = (req, res, next) => {
    passport.authenticate('facebook', async (err, user, accessToken) => {

        if (err) {
            return res.status(400).json({ error: err });
        }

        if (!user) {
            return res.redirect(`${process.env.CLIENT_URL}/signup?error=Email is already registered`);

            // return res.status(400).json({ message: 'Email is Already Exists' });
        }

        try {
            let tokenUpdate = await Token.findOne({ where: { userId: user.id } });

            if (!tokenUpdate) {
                tokenUpdate = await Token.create({
                    userId: user.id,
                    token: accessToken,
                    createdAt: Date.now(),
                    updateAt: Date.now()
                });
            } else {
                tokenUpdate.token = accessToken;
                tokenUpdate.updateAt = Date.now();
            }

            await tokenUpdate.save();
            return res.redirect('/dashboard');
        } catch (error) {
            console.error('Error saving token:', error);
            return next(error);
        }


    })(req, res, next);
};

// userController.js
exports.getUserData = (req, res) => {
    const { user } = req;
    res.status(200).json({
        name: user.name,
        email: user.email,
        profilePic: user.profilePic, // Asumsikan profilePic ada di model User
    });
};





exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (user.facebookId) {
            return res.status(401).json({ message: 'Email has been registered with Facebook login' });
        }
        if (user.googleId) {
            return res.status(401).json({ message: 'Email has been registered with Google login' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Email User Not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        await Token.create({ userId: user.id, token, });

        res.cookie('accessToken', token, { httpOnly: true, secure: true });
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
};

exports.validateLogin = () => [
    check('email').isEmail().withMessage('Enter a valid email'),
    check('password')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/)
        .withMessage('Password must be at least 8 characters long, contain one upper case, one lower case, one digit, and one special character'),
];

// exports.logout = (req, res) => {

//     res.clearCookie('accessToken');
//     res.redirect('/login');
// };

exports.logout = async (req, res) => {
    const userEmail = req.params.email;
    // console.log(req);


    try {
        const user = await User.findOne( { where: { email :userEmail}});


        if (user) {
            user.logoutAt = new Date();
            await user.save();
        }

        Object.keys(req.cookies).forEach(cookie => {
            res.clearCookie(cookie);
        });

        Object.keys(req.cookies).forEach(cookie => {
            res.clearCookie(cookie, { httpOnly: true, sameSite: 'none' });
        });

        // Ensure accessToken cookie is cleared with the correct options


        // res.clearCookie('accessToken');
        return res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to log out' });
    }
};
exports.loginFailure = (req, res) => {

    res.status(401).json({
        error: true,
        message: "Log in failure",
    });

}


exports.validateResetPassword = () => [
    check('oldPassword')
        .notEmpty()
        .withMessage('Old password is required'),
    check('newPassword')
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)/)
        .withMessage('New password must be at least 8 characters long, contain one upper case, one lower case, one digit, and one special character'),
    check('reenterNewPassword')
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage('New passwords do not match')
];

exports.resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!(await user.isValidPassword(oldPassword))) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (err) {
        next(err);
    }
};