const express = require('express')
const router = express.Router()
const taskRoutes = require('./task.routes')
const userRoutes = require('./user.routes')
const { tokenValidation } = require('../middleware/token')

router.use('/task', tokenValidation, taskRoutes)
router.use('/user', userRoutes)

module.exports = router