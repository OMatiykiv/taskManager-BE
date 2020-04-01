const { schemaJoiUser, UserSchema } = require('./user.model')
const Joi = require('joi')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

async function userExist (body) {
  const name = await UserSchema.findOne({ name: body.name })
  if (name) throw new Error("User with such name is already registered")
  const mail = await UserSchema.findOne({ mail: body.mail })
  if (mail) throw new Error("User with such mail is already registered")
}
async function registerValidation (body) {
  const { error } = Joi.validate(body, schemaJoiUser)
  if (error) throw new Error('Bad Request')
}
async function register (body) {
  await userExist(body)
  await registerValidation(body)
  const salt = bcrypt.genSaltSync(config.get('saltRounds'));
  body.password = bcrypt.hashSync(body.password, salt)
  const user = await UserSchema.create(body)
  return user
}

async function tokenGeneration (user) {
  const payload = {
    id: user._id,
    name: user.name,
    mail: user.mail
  }
  const accessToken = jwt.sign(payload, config.get('accessToken'), { expiresIn: config.get('expireToken') })
  const refreshToken = jwt.sign(payload, config.get('refreshToken'))
  return { accessToken: accessToken, refreshToken: refreshToken }
}
async function loginValidation (body) {
  const user = await UserSchema.findOne({ name: body.name })
  if (!user) throw new Error(`Such user isn't registered`)
  const password = await bcrypt.compare(body.password, user.password)
  if (!password) throw new Error('Incorrect password')
  return user
}
async function login (body) {
  const user = await loginValidation(body)
  const token = tokenGeneration(user)
  return token
}

exports.register = register
exports.login = login