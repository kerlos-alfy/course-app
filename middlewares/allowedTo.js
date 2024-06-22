const AppError = require('../utils/appError')
const httpStatusText = require('../utils/httpStatusText')

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {
            const error = AppError.create('User Not Allowed', 401, httpStatusText.ERROR)
            return next(error)
        }
        next()
    }
}
