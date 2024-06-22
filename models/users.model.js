const mongoose = require('mongoose')
const validator = require('validator')
const userRoles = require('../utils/userRoles')
const userSchema = new mongoose.Schema(
    {
        fristName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, 'Field  must be a valid email'],
        },
        password: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        },
        role: {
            type: String, // [User, Admin, Manager]
            enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
            default: userRoles.USER,
        },
        avatar: {
            type: String,
            default: 'uploads/avatar.png',
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)
