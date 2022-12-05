const express = require('express')
const morgan = require('morgan')

const app = express()

const testRoute = require('./routes/testRoutes')
const bodyParser = require("body-parser");

app.use(morgan('dev'))
app.use(bodyParser.json())

app.use('/', testRoute.routes)
// app.use('/users', userRoute.routes)

module.exports = app