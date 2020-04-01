const mongoose = require('mongoose')
const Joi = require('joi')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {type: String, minlength: 4, maxlength: 255, required: true},
  mail: {type: String, required: true},
  password: { type: String, maxlength: 255, required: true }
})

const schema = {
  name: Joi.string().min(4).max(255).required(),
  mail: Joi.string().email().required(),
  password: Joi.string().max(255).required()
}

exports.schemaJoiUser = schema
exports.UserSchema = mongoose.model('User', UserSchema)