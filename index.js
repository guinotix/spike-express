const express = require('express')
const products = require('./src/routes/products')

const app = express()
const PORT = 3000

app.use('/products', products)

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.listen(PORT, () => {
    console.log(`App escuchando en el puerto ${PORT}`)
})
