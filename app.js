const express = require('express')
const morgan = require('morgan')
const bodyParser = require("body-parser");

const testRoute = require('./routes/testRoutes')
const usersRoute = require('./routes/userRoutes')

const app = express()

// Middleware
app.use(morgan('dev'))
app.use(bodyParser.json())

app.use('/', testRoute.routes)
app.use('/auth', usersRoute.routes)


module.exports = app