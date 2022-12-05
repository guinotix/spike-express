const app = require('./app')
const PORT = 3000

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

app.listen(PORT, () => {
    console.log(`App escuchando en el puerto ${PORT}`)
})
