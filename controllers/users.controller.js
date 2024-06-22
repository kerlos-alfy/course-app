const User = require('../models/users.model')
const httpStatusText = require('../utils/httpStatusText')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const generateJWT = require('../utils/generateJWT')
// TODO GET All Users
const getAllUsers = asyncWrapper(async (req, res) => {
    const query = req.query
    const limit = query.limit || 10
    const page = query.page || 1
    const skip = (page - 1) * limit
    // !Get All Users Form Mongoose
    const users = await User.find({}, { __v: false, createdAt: false, updatedAt: false, password: false })
        .limit(limit)
        .skip(skip)
    res.json({ page, status: httpStatusText.SUCCESS, data: { users } })
})

// TODO Register
const register = asyncWrapper(async (req, res, next) => {
    const { fristName, lastName, email, password, role } = req.body

    const oldUser = await User.find({ email: email })
    if (oldUser.length > 0) {
        const error = AppError.create('User already exists', 400, httpStatusText.ERROR)
        return next(error)
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = await new User({
        fristName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename,
    })
    // Generate Token
    const token = await generateJWT({ email: newUser.email, id: newUser._id, role: newUser.role })
    newUser.token = token

    await newUser.save()
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { Add: newUser } })
})

// TODO Login
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        const error = AppError.create('email and password are required', 400, httpStatusText.ERROR)
        return next(error)
    }
    const user = await User.findOne({ email: email })
    if (!user) {
        const error = AppError.create('User is not found', 400, httpStatusText.ERROR)
        return next(error)
    }
    const matchedPassword = await bcrypt.compare(password, user.password)

    if (!user || !matchedPassword) {
        const error = AppError.create('email or password is incorrect', 400, httpStatusText.ERROR)
        return next(error)
    }
    const token = await generateJWT({ email: user.email, id: user._id, role: user.role })
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { token } })
})

// TODO Export Controller User
module.exports = {
    getAllUsers,
    register,
    login,
}
