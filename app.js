const express = require('express')
const app = express()
const mongoose = require('mongoose')
const coursRouter = require('./routes/course.route')
const userRouter = require('./routes/users.route')
const httpStatusText = require('./utils/httpStatusText')
const path = require('node:path')
// const path = require('path')
require('dotenv').config()
const cors = require('cors')
const url = process.env.MONGO_URI
app.use(cors())

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

mongoose
    .connect(url)
    .then(() => {
        console.log('Mongo DB Connected Success')
    })
    .catch((error) => {
        console.log(error)
    })
app.use(express.json())

app.use('/api/courses', coursRouter)
app.use('/api/users', userRouter)

// TODO Global Middleware Not Found Route
app.all('*', (req, res, next) => {
    res.status(404).json({ status: httpStatusText.ERROR, msg: 'This Resource is not found' })
})

// TODO Global Error Handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatusText.ERROR,
        message: error.message,
        code: error.statusCode || 500,
    })
})

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
