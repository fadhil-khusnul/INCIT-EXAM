const { Op } = require('sequelize');
const moment = require('moment');
const User = require('../models/User');

exports.getDashboardStats = async(req, res) => {
    try {
        const totalSignups = await User.count();

        const activeSessionsToday = await User.count({
            where: {
                updatedAt: {
                    [Op.gte]: moment().startOf('day').toDate(),
                }
            }
        });

        const averageActiveSessions = await User.count({
            where: {
                updatedAt: {
                    [Op.gte]: moment().subtract(7, 'days').startOf('day').toDate(),
                }
            }
        }) / 7;

        return res.json({
            totalSignups,
            activeSessionsToday,
            averageActiveSessions,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};


exports.getUsersData = async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['name', 'email', 'createdAt', 'loginCount', 'logoutAt'],
        });
        if (!users) {
          return res.status(400).json({ error: 'User Not Found' });

          
        }

        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch user data' });
    }
};