const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Token extends Model {}

Token.init({
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updateAt: {
        type: DataTypes.DATE,
    }
}, {
    sequelize,
    modelName: 'Token'
});

module.exports = Token;