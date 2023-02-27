const { Router } = require('express')
const router = Router();

const { db } = require('../firebase')

const {
    activarServicioDeUbicacion,
    desactivarServicioDeUbicacion,
    verEstadoServicioEnUbicacion,
    activarAPIdelSelector,
    desactivarAPIdelSelector
} = require("../logicaServicios");


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

// Activar individualmente un servicio a través de la ubicacion
router.put('/activarServicio/:usu/:ubiid/:serv', async (req, res) => {
    // Si el servicio ahora está desactivado, rechazar operacion
    const user = req.params.usu
    const id = req.params.ubiid
    const servicio = req.params.serv
    const docSnap = await db.collection('col4-serviciosLocalesUsuarios').doc(user).get()
    const estadoSelector = await docSnap.get(`${servicio}`)

    // Solo puedo activar cuando el servicio está inactivo
    const estadoActualDelServicio = await verEstadoServicioEnUbicacion(id, servicio)

    if (estadoSelector && !estadoActualDelServicio) {
        await activarServicioDeUbicacion(user, id, servicio)
        res.status(200).send('Activado correctamente')
    } else {
        res.status(400).send('El servicio está desactivado en el selector')
    }
})

// Desactivar individualmente un servicio a través de la ubicacion
router.put('/desactivarServicio/:usu/:ubiid/:serv', async (req, res) => {
    const user = req.params.usu
    const id = req.params.ubiid
    const servicio = req.params.serv
    const docSnap = await db.collection('col4-serviciosLocalesUsuarios').doc(user).get()
    const estadoSelector = await docSnap.get(`${servicio}`)

    // Solo puedo desactivar cuando el servicio está activo
    const estadoActualDelServicio = await verEstadoServicioEnUbicacion(id, servicio)

    if (estadoSelector && estadoActualDelServicio) {
        await desactivarServicioDeUbicacion(user, id, servicio)
        res.status(200).send('Desactivado correctamente')
    } else {
        res.status(400).send('El servicio está desactivado en el selector')
    }
})

// Activar servicio por el selector
router.put('/selectorAPI/activar/:usu/:serv', async (req, res) => {
    const user = req.params.usu
    const servicio = req.params.serv
    await activarAPIdelSelector(user, servicio)
    // Devolver el resultado de X forma(?)
    // ...
})

// Desactivar servicio por el selector
router.put('/selectorAPI/desactivar/:usu/:serv', async (req, res) => {
    const user = req.params.usu
    const servicio = req.params.serv
    await desactivarAPIdelSelector(user, servicio)
    // Devolver el resultado de X forma(?)
    // ...
})


module.exports = {
    routes: router
}