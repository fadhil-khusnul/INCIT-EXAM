const express = require('express');
const authControllers = require('../controllers/authControllers');
const oauthControllerGoogle = require('../controllers/oauthControllerGoogle');
const authMiddleware = require('../middleware/middleware');
const router = express.Router();



router.post('/signup', authControllers.validateSignup(), authControllers.signup);
router.get('/verify/:token', authControllers.verifyToken)

// Google OAuth
router.get('/google', oauthControllerGoogle.googleAuth);
router.get('/google/callback', oauthControllerGoogle.googleCallback);

// Facebook OAuth
router.get('/facebook', authControllers.facebookSignup);
router.get('/facebook/callback', authControllers.facebookCallback);

router.post('/login', authControllers.validateLogin(), authControllers.login);
router.post('/reset-password', authMiddleware,  authControllers.validateResetPassword(), authControllers.resetPassword);

router.get('/logout', authMiddleware, authControllers.logout);
router.get('/login/failed', authControllers.loginFailure);
router.get('/user-profile', authMiddleware, authControllers.getUserData);
router.post('/edit-profile', authMiddleware, authControllers.editProfile);


module.exports = router;