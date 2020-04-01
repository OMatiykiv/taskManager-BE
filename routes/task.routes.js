const express = require('express')
const router = express.Router()
const taskController = require('../task/task.controller')

router.get('/', taskController.getTasksController)
router.post('/', taskController.createTaskController)
router.put('/:id', taskController.updateTaskController)
router.delete('/:id', taskController.deleteTaskController)
router.put('/share/:id', taskController.shareTaskController)
router.get('/:id', taskController.getTaskController)

module.exports = router