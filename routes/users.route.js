const express = require('express')
const multer = require('multer')
const router = express.Router()
const userController = require('../controllers/users.controller')
const verifyToken = require('../middlewares/verifyToken')
const AppError = require('../utils/appError')

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1]
        const fileName = `user-${req.body.fristName}${Date.now()}.${ext}`
        cb(null, fileName)
    },
})
const fileFilter = function (req, file, cb) {
    const imageType = file.mimetype.split('/')[0]
    if (imageType === 'image') {
        cb(null, true)
    } else {
        return cb(AppError.create('file must be an image', 400), false)
    }
}

const upload = multer({ storage: diskStorage, fileFilter })

//TODO: Get All Courses
router.route('/').get(verifyToken, userController.getAllUsers)

//TODO: Register
router.route('/register').post(upload.single('avatar'), userController.register)

//TODO: Login
router.route('/login').post(userController.login)

module.exports = router
