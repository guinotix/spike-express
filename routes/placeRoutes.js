const { Router } = require('express')
const router = Router();

const { db } = require('../firebase')
const { crearServicioEnUbicacion, borrarTodosServiciosDeUbicacion } = require("../logicaServicios");


// Añadir ubicacion por toponimo
router.post('/toponimo/:usu', async (req, res) => {
    const user = req.params.usu
    const { sitio, pais, latitud, longitud } = req.body
    const colRef = await db.collection('col1-ubicaciones')
    const query = await colRef
        .where('user', '==', user)
        .where('placename', '==', sitio)
        .where('country', '==', pais)
    const call = await query.get()
    if (!call.empty) {
        res.status(400).send('La ubicacion existe')
    } else {
        const ubi = {
            usuario: user,
            toponimo: sitio,
            country: pais,
            lat: latitud,
            lon: longitud,
            alias: '',
            disabled: false
        }
        const docRef = await colRef.doc()
        await docRef.set(ubi)

        // Crear los servicios de esa ubicación
        await crearServicioEnUbicacion(user, docRef.id, 'eventos')
        await crearServicioEnUbicacion(user, docRef.id, 'noticias')
        await crearServicioEnUbicacion(user, docRef.id, 'tiempo')

        res.status(200).json({ id: docRef.id, data: ubi })
    }
})

// Añadir ubicacion por coordenadas
router.post('/coordenadas/:usu', async (req, res) => {
    const user = req.params.usu
    const { sitio, pais, latitud, longitud } = req.body
    const colRef = await db.collection('col1-ubicaciones')
    const query = await colRef
        .where('user', '==', user)
        .where('lat', '==', latitud)
        .where('lon', '==', longitud)
    const call = await query.get()
    if (!call.empty) {
        res.status(400).send('La ubicacion existe')
    } else {
        const ubi = {
            usuario: user,
            toponimo: sitio,
            country: pais,
            lat: latitud,
            lon: longitud,
            alias: '',
            disabled: false
        }
        const docRef = await colRef.doc()
        await docRef.set(ubi)

        // Crear los servicios de esa ubicación
        await crearServicioEnUbicacion(user, docRef.id, 'eventos')
        await crearServicioEnUbicacion(user, docRef.id, 'noticias')
        await crearServicioEnUbicacion(user, docRef.id, 'tiempo')

        res.status(200).json({ id: docRef.id, data: ubi })
    }
})

// Borrar ubicacion
router.delete('/:ubiid', async (req, res) => {
    const id = req.params.ubiid
    const colRef = await db.collection('col1-ubicaciones')
    const docRef = await colRef.doc(id)
    const call = await docRef.get()
    if (!call.exists) {
        res.status(400).send('La ubicacion no existe')
    } else {
        const ubi = {
            id: call.id, data: call.data()
        }
        await docRef.delete()

        // Borrar los servicios cuyo id_ubicacion coincidan en la colección de servicios
        await borrarTodosServiciosDeUbicacion(id)

        res.status(200).json({ id: docRef.id, data: ubi })
    }
})

// Cambiar alias
router.put('/alias/:ubiid', async (req, res) => {
    const id = req.params.ubiid
    const { nuevoAlias } = req.body
    const colRef = await db.collection('col1-ubicaciones')
    const docRef = await colRef.doc(id)
    const call = await docRef.get()
    if (!call.exists) {
        res.status(400).send('La ubicacion no existe')
    } else {
        await docRef.update({
            alias: nuevoAlias
        })
        res.status(200).json({ id: call.id, data: call.data() })
    }
})

// Activar ubicacion
router.put('/activar/:ubiid', async (req, res) => {
    const id = req.params.ubiid
    const colRef = await db.collection('col1-ubicaciones')
    const docRef = await colRef.doc(id)
    const call = await docRef.get()
    if (!call.exists) {
        res.status(400).send('La ubicacion no existe')
    } else {
        if (call.data().disabled) {
            await docRef.update({
                disabled: false
            })
            res.status(200).json({ id: call.id, data: call.data() })
        } else {
            res.status(400).send('La ubicación ya está activa')
        }
    }
})

// Desactivar ubicacion
router.put('/desactivar/:ubiid', async (req, res) => {
    const id = req.params.ubiid
    const colRef = await db.collection('col1-ubicaciones')
    const docRef = await colRef.doc(id)
    const call = await docRef.get()
    if (!call.exists) {
        res.status(400).send('La ubicacion no existe')
    } else {
        if (!call.data().disabled) {
            await docRef.update({
                disabled: true
            })
            res.status(200).json({ id: call.id, data: call.data() })
        } else {
            res.status(400).send('La ubicación ya está inactiva')
        }
    }
})

// Obtener ubicaciones que estén activas
router.get('/activas/:usuario', async (req, res) => {
    const user = req.params.usuario
    const colRef = await db.collection('col1-ubicaciones')
    const query = await colRef
        .where('usuario', '==', user)
        .where('disabled', '==', false)
    const call = await query.get()
    if (call.empty) {
        res.status(400).send('No hay ubicaciones activas')
    } else {
        let array = []
        call.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            array.push({ id, data })
        })
        res.status(200).send({ array })
    }
})

// Obtener ubicaciones que estén inactivas
router.get('/inactivas/:usuario', async (req, res) => {
    const user = req.params.usuario
    const colRef = await db.collection('col1-ubicaciones')
    const query = await colRef
        .where('usuario', '==', user)
        .where('disabled', '==', true)
    const call = await query.get()
    if (call.empty) {
        res.status(400).send('No hay ubicaciones inactivas')
    } else {
        let array = []
        call.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            array.push({ id, data })
        })
        res.status(200).send({ array })
    }
})

// Ver mis ubicaciones
router.get('/:usuario', async (req, res) => {
    const user = req.params.usuario
    const colRef = await db.collection('col1-ubicaciones')
    const query = await colRef.where('usuario', '==', user)
    const call = await query.get()
    if (call.empty) {
        res.status(400).send(`El usuario ${user} no tiene ubicaciones`)
    } else {
        let array = []
        call.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            array.push({ id, data })
        })
        res.status(200).send({ array })
    }
})

// Ver una ubicacion
router.get('/veruna/:ubiid', async (req, res) => {
    // const user = req.params.usu
    const id = req.params.ubiid
    const colRef = await db.collection('col1-ubicaciones')
    const docRef = await colRef.doc(id)
    const call = await docRef.get()
    if (!call.exists) {
        res.status(400).send('La ubicacion no existe')
    } else {
        res.status(200).json({ id: call.id, data: call.data() })
    }
})


module.exports = {
    routes: router
}