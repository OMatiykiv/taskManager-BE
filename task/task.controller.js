const { getTasks, createTask, updateTask, deleteTask, shareTask, getTask } = require('./task.services')
module.exports = { getTasksController, createTaskController, updateTaskController, deleteTaskController, shareTaskController, getTaskController }

async function getTasksController (req, res, next) {
  try {
    res.json(await getTasks(req.headers.access))
  } catch (e) {
    next(e)
  }
}

async function createTaskController (req, res, next) {
  try {
    res.json(await createTask(req.body, req.headers.access))
  } catch (e) {
    next(e)
  }
}

async function updateTaskController (req, res, next) {
  try {
    res.json(await updateTask(req.body, req.params.id, req.headers.access))
  } catch (e) {
    next(e)
  }
}

async function deleteTaskController (req, res, next) {
  try {
    console.log(req.params.id)
    res.json(await deleteTask(req.params.id, req.headers.access))
  } catch (e) {
    next(e)
  }
}

async function shareTaskController (req, res, next) {
  try {
    res.json(await shareTask(req.body.mail, req.params.id, req.headers.access))
  } catch (e) {
    next(e)
  }
}

async function getTaskController (req, res, next) {
  try {
    res.json(await getTask(req.params.id, req.headers.access))
  } catch (e) {
    next(e)
  }
}