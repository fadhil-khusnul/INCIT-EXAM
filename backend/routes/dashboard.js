const express = require('express');
const authControllers = require('../controllers/authControllers');
const { getDashboardStats, getUsersData } = require('../controllers/dashboardController');
const router = express.Router();



router.get('/dashboard-stats', getDashboardStats)
router.get('/users', getUsersData)

module.exports = router