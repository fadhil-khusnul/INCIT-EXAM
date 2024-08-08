const express = require('express');
const authControllers = require('../controllers/authControllers');
const router = express.Router();



router.post('/signup', authControllers.validateSignup(), authControllers.signup);
router.get('/verify/:token', authControllers.verifyToken)

// Google OAuth
router.get('/google', authControllers.googleSignup);
router.get('/google/callback', authControllers.googleCallback);

// Facebook OAuth
router.get('/facebook', authControllers.facebookSignup);
router.get('/facebook/callback', authControllers.facebookCallback);

router.get('/logout', authControllers.logout);
module.exports = router;