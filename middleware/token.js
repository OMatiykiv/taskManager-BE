const config = require('config')
const jwt = require('jsonwebtoken')
async function tokenValidation (req, res, next) {
  try {
    const access = req.headers.access
    const refresh = req.headers.refresh
    if (!access) throw new Error('Unauthorized')
    await jwt.verify(access, config.get('accessToken'), async err => {
      if (err) {
        if (err.message !== 'jwt expired') throw new Error('Access denied')
        if (!refresh) throw new Error('Unauthorized')
        await jwt.verify(refresh, config.get('refreshToken'), async err => {
          if (err) throw new Error('Access denied.')
          const user = await jwt.decode(refresh)
          res.set({ accessToken: jwt.sign(user, config.get('accessToken'), { expiresIn: config.get('expireToken') }) })
        })
      }
    })
    next()
  } catch (e) {
    next(e)
  }
}

exports.tokenValidation = tokenValidation
