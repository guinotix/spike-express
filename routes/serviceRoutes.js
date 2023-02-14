const { Router } = require('express')
const router = Router();

const { db } = require('../firebase')


// Consultar qué servicios globales hay en la app
router.get('/globals', async (req, res) => {
    const colRef = await db.collection('col3-serviciosGlobales')
    const call = await colRef.get()
    let services = []
    call.forEach((doc) => {
        const id = doc.id
        const data = doc.data()
        services.push({ id, data })
    })
    res.status(200).json({ services })
})

// Consultar qué servicios tiene una ubicacion de un usuario
router.get('/consultaServicios/:usu/:ubiid', async (req, res) => {
    const user = req.params.usu
    const id = req.params.ubiid
    const colRef = await db.collection('col2-servicios')
    const query = await colRef
        .where('usuario', '==', user)
        .where('id_ubicacion', '==', id)
    const call = await query.get()
    if (call.empty) {
        res.status(400).send(`La ubicacion ${id} no tiene servicios`)
    } else {
        let services = []
        call.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            services.push({ id, data })
        })
        res.status(200).json({ services })
    }
})


module.exports = {
    routes: router
}