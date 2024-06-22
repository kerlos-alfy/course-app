const jwt = require('jsonwebtoken')
const httpStatusText = require('../utils/httpStatusText')
const AppError = require('../utils/appError')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization']
    // ! Token not found in Authorization
    if (!authHeader) {
        const error = AppError.create('token is required', 401, httpStatusText.ERROR)
        return next(error)
    }
    // TODO remove Bearer authentication
    const token = authHeader.split(' ')[1]

    // TODO Send Valid Token
    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET)
        req.currentUser = currentUser

        next()
    } catch (err) {
        // TODO Not valid token
        const error = AppError.create('invalid token', 401, httpStatusText.ERROR)

        return next(error)
    }
}

module.exports = verifyToken
