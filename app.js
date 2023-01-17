const express = require('express')
const morgan = require('morgan')
const bodyParser = require("body-parser");

const testRoute = require('./routes/testRoutes')
const usersRoute = require('./routes/userRoutes')
const placesRoute = require('./routes/placeRoutes')
const serviceRoute = require('./routes/serviceRoutes')

const app = express()

// Middleware
app.use(morgan('dev'))
app.use(bodyParser.json())

app.use('/', testRoute.routes)
app.use('/auth', usersRoute.routes)
app.use('/ubicaciones', placesRoute.routes)
app.use('/servicios', serviceRoute.routes)


module.exports = app