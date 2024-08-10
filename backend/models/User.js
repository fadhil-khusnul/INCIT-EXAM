const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profilePic: {
        type: DataTypes.STRING,
        allowNull: true
    },
    facebookId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    verificationToken: {
        type: DataTypes.TEXT,
        notNull: false,
        default: null
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: DataTypes.DATE,
        notNull: true,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        notNull: true,
    },
    loginCount: {
        type: DataTypes.INTEGER,
        notNull: true,
        defaultValue: 0
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        notNull: false,
        defaultValue: null
    },
    logoutAt: {
        type: DataTypes.DATE,
        notNull: false,
        defaultValue: null
    },

}, {
    sequelize,
    modelName: 'User',
    timestamps: true,

    hooks: {
        beforeSave: async(user) => {
            if (user.password && user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

module.exports = User;