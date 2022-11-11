const express = require('express')

const testRoute = require('./routes/testRoutes')

const app = express()
const PORT = 3000

app.use('/apiTest', testRoute.routes)

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.listen(PORT, () => {
    console.log(`App escuchando en el puerto ${PORT}`)
})
