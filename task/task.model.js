const mongoose = require('mongoose')
const Joi = require('joi')
const Schema = mongoose.Schema

const TaskSchema = new Schema({
  title: {type: String, minlength: 3, maxlength: 255, required: true},
  description: { type: String, minlength: 3, required: true },
  status: {type: String, enum: ['View', 'Progress', 'Checking', 'Done'], required: true},
  users: {type: Array}
})

const schema = {
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(3).required(),
  status: Joi.string().required(),
  users: Joi.array().items(Joi.object({
    role: Joi.string().required(),
    user: Joi.string().required(),
    invited: Joi.string()
  }))
}

exports.schemaJoiTask = schema
exports.TaskSchema = mongoose.model('Task', TaskSchema)