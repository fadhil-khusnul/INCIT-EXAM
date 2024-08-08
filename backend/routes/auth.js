const express = require('express');
const authControllers = require('../controllers/authControllers');
const router = express.Router();



router.post('/signup', authControllers.validateSignup(), authControllers.signup);
router.get('/verify/:token', authControllers.verifyToken)




module.exports = router;