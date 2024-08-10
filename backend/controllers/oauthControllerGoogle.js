const { google } = require('googleapis'); // Correct import statement
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost:5000/api/auth/google/callback'
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
]

const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
})

const accessValidation = (req, res, next) => {
    const { authorization } = req.headers;

    console.log('here: ', authorization);

    if (!authorization) {
        return res.status(401).json({
            message: 'Token diperlukan'
        });
    }

    const token = authorization.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    try {
        const jwtDecode = jwt.verify(token, secret);

        if (typeof jwtDecode !== 'string') {
            req.userData = jwtDecode;
        }
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    next();
};


exports.googleAuth = (req, res, next) => {
    res.redirect(authorizationUrl);
};

exports.googleCallback = async (req, res, next) => {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
    });

    const { data } = await oauth2.userinfo.get();

    console.log(data);

    if (!data.email || !data.name) {
        return res.json({
            data: data,
        });
    }

    let user = await User.findOne({
        where: {
            email: data.email
        }
    });

    if (!user) {

        user = await User.create({
            google: data.id,
            email: data.email,
            name: data.name,
            profilePic: data.picture,

        });
    } else {
        // Increment login count
        user.loginCount += 1;
        await user.save();
    }

    const payload = {
        id: user.id,
        name: user.name,
    };

    const secret = process.env.JWT_SECRET;
    const expiresIn = 60 * 60 * 1;
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn });


    res.cookie('accessToken', token);


    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);




    // return res.json({
    //     data: {
    //         id: user.id,
    //         name: user.name,
    //         profilePic: data.picture,

    //     },
    //     token: token
    // });
};