const express = require('express')
const products = require('./src/routes/products')
const bodyParser = require('body-parser')

const app = express()
const PORT = 3000

app.use(bodyParser.json())

app.use('/products', products)

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.listen(PORT, () => {
    console.log(`App escuchando en el puerto ${PORT}`)
})
