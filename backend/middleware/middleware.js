const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Sesuaikan path dengan model User kamu

const authMiddleware = async (req, res, next) => {
  try {


    const token = req.headers.authorization?.split(' ')[1];




    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;