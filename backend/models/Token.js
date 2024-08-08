const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '1d' } // Token expires in 1 day
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;