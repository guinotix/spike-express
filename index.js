const express = require('express')

const http = require('http')

const coordenadasCastellon = [39.97, -0.05]
const url = 'http://api.openweathermap.org/geo/1.0/'
// apikey ...


const app = express()
const PORT = 3000

app.get('/', (req, res) => {
    res.send('Hola mundo')
})

http.get(url +
    `reverse?lat=${coordenadasCastellon[0]}&lon=${coordenadasCastellon[1]}&appid=${apikey}`,
    (res) => {

        let data = ""

        res.on('data', (info) => {
            data += info
        });

        res.on('end', () => {
            console.log(' --- {Dentro del END} ---')
            console.log(JSON.parse(data))
        });

});

app.listen(PORT, () => {
    console.log(`App escuchando en el puerto ${PORT}`)
})
