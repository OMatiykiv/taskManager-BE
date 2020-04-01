const { register, login } = require('./user.services')
module.exports = { registerController, loginController }

async function registerController (req, res, next) {
  try {
    res.json(await register(req.body))
  } catch (e) {
    next(e)
  }
}

async function loginController (req, res, next) {
  try {
    res.json(await login(req.body))
  } catch (e) {
    next(e)
  }
}