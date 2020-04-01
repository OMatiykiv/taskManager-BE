const { TaskSchema, schemaJoiTask } = require('./task.model')
const { UserSchema } = require('../user/user.model')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

async function identifyUser (access) {
  return jwt.decode(access)
}
async function havePermission (users, id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].user === id) {
      return
    } 
  }
  throw new Error(`You have no permission for this action`)
}
async function getTasks (access) {
  const user = await identifyUser(access)
  const tasks = await TaskSchema.aggregate( [ 
    { $unwind: "$users" },
    { $match: { "users.user" : user.id } },
    { $addFields: {"invited": "$users.invited"}},
    { $project: {_id: 1, title: 1, description: 1, status: 1, invited: { $ifNull: [ "$invited", "You created this task" ] } } }
  ] )
  return tasks
}

async function taskValidation (body) {
  const { error } = Joi.validate(body, schemaJoiTask)
  if (error) throw new Error('Bad Request')
}
async function createTask (body, access) {
  taskValidation(body)
  const user = await identifyUser(access)
  body.users = [];
  body.users.push({'role': 'Owner', 'user': user.id})
  const task = await TaskSchema.create(body)
  return task
}

async function isTaskExist (id) {
  const task = await TaskSchema.findOne({ _id: id })
  if (!task) throw new Error('task does not exist')
  return task
}
async function updateTask (body, id, access) {
  taskValidation(body)
  const task = await isTaskExist(id)
  const user = await identifyUser(access)
  await havePermission (task.users, user.id)
  body.users = task.users
  await TaskSchema.updateOne({ _id: id }, body)
  return body
}

async function deleteTask (id, access) {
  const task = await isTaskExist(id)
  const user = await identifyUser(access)
  await havePermission (task.users, user.id)
  await TaskSchema.deleteOne({ _id: id })
  return task
}

async function isInviteUserRegister(mail) {
  const user = await UserSchema.findOne({ mail: mail})
  if (!user) throw new Error(`Such user isn't registered in the system`)
  return user
}
async function isUserInvitedBefore(users, id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].user == id) throw new Error(`This user was invited before`)
  }
}
async function shareTask (mail, taskId, access) {
  const invitedUser = await isInviteUserRegister(mail)
  const task = await isTaskExist(taskId)
  const user = await identifyUser(access)
  await havePermission (task.users, user.id)
  await isUserInvitedBefore(task.users, invitedUser._id)
  task.users.push({'role': 'Invited', 'user': `${JSON.parse(JSON.stringify(invitedUser._id))}`, 'invited': user.name })
  await TaskSchema.updateOne({ _id: taskId }, task)
  return `user is invited`
}

async function getTask (id, access) {
  const user = await identifyUser(access)
  const task = await TaskSchema.aggregate( [ 
    { $match: { _id : ObjectId(id) } },
    { $unwind: "$users" },
    { $match: { "users.user" : user.id } },
    { $project: {_id: 1, title: 1, description: 1, status: 1 } }
  ] )
  return task[0]
}

exports.getTasks = getTasks
exports.createTask = createTask
exports.updateTask = updateTask
exports.deleteTask = deleteTask
exports.shareTask = shareTask
exports.getTask = getTask