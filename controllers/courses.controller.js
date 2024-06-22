const { validationResult } = require('express-validator')
const Course = require('../models/courses.model')
const httpStatusText = require('../utils/httpStatusText')
const asyncWrapper = require('../middlewares/asyncWrapper')
const AppError = require('../utils/appError')

// TODO GET All Courses
const getAllCourse = asyncWrapper(async (req, res) => {
    const query = req.query
    const limit = query.limit || 10
    const page = query.page || 1
    const skip = (page - 1) * limit
    // Get All Courses Form Mongoose
    const courses = await Course.find({}, { __v: false, createdAt: false, updatedAt: false })
        .limit(limit)
        .skip(skip)
    res.json({ page, status: httpStatusText.SUCCESS, data: { courses } })
})
// TODO GET Course By Id
const getCourseById = asyncWrapper(async (req, res, next) => {
    const course = await Course.findById(req.params.CourseId)
    if (!course) {
        const error = AppError.create('Not Found Course', 404, httpStatusText.ERROR)
        return next(error)
    }
    return res.json({ status: httpStatusText.SUCCESS, data: { course } })
})

// TODO Create Course
const createCourse = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = AppError.create(errors.array(), 400, httpStatusText.ERROR)
        return next(error)
    }
    const newCourse = new Course(req.body)
    await newCourse.save()
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { Add: newCourse } })
})

// TODO Update Course
const updateCourse = asyncWrapper(async (req, res, next) => {
    const updateCourse = await Course.findByIdAndUpdate(
        req.params.CourseId,
        {
            $set: { ...req.body },
        },
        {
            new: true,
        }
    )
    if (!updateCourse) {
        const error = AppError.create('Not Fount This Course', 404, httpStatusText.ERROR)
        return next(error)
    }
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { Updated: updateCourse } })
})

// TODO Delete Course
const deleteCourse = asyncWrapper(async (req, res, next) => {
    const deleteCourse = await Course.findByIdAndDelete(req.params.CourseId)
    if (!deleteCourse) {
        const error = AppError.create('Not Fount This Course', 404, httpStatusText.ERROR)
        return next(error)
    }
    res.status(201).json({ status: httpStatusText.SUCCESS, data: null })
})

// TODO Export Controller Course
module.exports = {
    getAllCourse,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
}
