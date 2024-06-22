const express = require('express')
const router = express.Router()
const courseController = require('../controllers/courses.controller')
const { creatCourseValidatos } = require('../utils/course.Validetors')
const verifyToken = require('../middlewares/verifyToken')
const userRoles = require('../utils/userRoles')
const allowedTo = require('../middlewares/allowedTo')
//TODO: Get All Courses
//TODO: Create Course
router
    .route('/')
    .get(verifyToken, courseController.getAllCourse)
    .post(creatCourseValidatos, courseController.createCourse)

//TODO: Get Specific Course
//TODO: Update Course
//TODO: Delete Course
router
    .route('/:CourseId')
    .get(courseController.getCourseById)
    .patch(courseController.updateCourse)
    .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), courseController.deleteCourse)

module.exports = router
