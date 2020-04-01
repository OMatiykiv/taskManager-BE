const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require("cors")
const api = require('./routes')
const app = express()
const devDbUrl = config.get('db')
const mongoDB = process.env.MONGODB_URI || devDbUrl

mongoose.connect(mongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  serverSelectionTimeoutMS: 3000
}).catch(err => console.log(err.reason))

mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({ origin: "*" }))
app.use('/api', api)
app.use((err, req, res, next) => {
  if(err.status) {
    res.status(err.status).send(err.message)
  } else {
    res.status(500).send(err.message)
  }
})

const port = process.env.PORT || config.get('port')
const server = app.listen(port, () => {
  console.log('Server is up and running on port number ' + port)
})

module.exports = app
