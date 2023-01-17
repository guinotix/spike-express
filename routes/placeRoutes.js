const { Router } = require('express')
const router = Router();

const { db } = require('../firebase')


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
        res.send('La ubicacion existe')
    } else {
        await colRef.doc().set({
            usuario: user,
            toponimo: sitio,
            country: pais,
            lat: latitud,
            lon: longitud,
            alias: '',
            disabled: false
        })
        res.send(`${sitio} añadido`)
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
        res.send('La ubicacion existe')
    } else {
        await colRef.doc().set({
            usuario: user,
            toponimo: sitio,
            country: pais,
            lat: latitud,
            lon: longitud,
            alias: '',
            disabled: false
        })
        res.send(`${sitio} añadido`)
    }
})

// Borrar ubicacion
router.delete('/:ubiid', async (req, res) => {
    const id = req.params.ubiid
    const colRef = await db.collection('col1-ubicaciones')
    const docRef = await colRef.doc(id)
    const call = await docRef.get()
    if (!call.exists) {
        res.send('La ubicacion no existe')
    } else {
        await docRef.delete()
        res.send(`${id} borrado`)
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
        res.send('La ubicacion no existe')
    } else {
        await docRef.update({
            alias: nuevoAlias
        })
        res.send(`Alias actualizado. Nuevo alias: ${nuevoAlias}`)
    }
})

// Activar ubicacion
router.put('/activar/:ubiid', async (req, res) => {
    const id = req.params.ubiid
    const colRef = await db.collection('col1-ubicaciones')
    const docRef = await colRef.doc(id)
    const call = await docRef.get()
    if (!call.exists) {
        res.send('La ubicacion no existe')
    } else {
        if (call.data().disabled) {
            await docRef.update({
                disabled: false
            })
            res.send('Ubicación activada')
        } else {
            res.send('La ubicación ya está activa')
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
        res.send('La ubicacion no existe')
    } else {
        if (!call.data().disabled) {
            await docRef.update({
                disabled: true
            })
            res.send('Ubicación desactivada')
        } else {
            res.send('La ubicación ya está inactiva')
        }
    }
})

// Obtener ubicaciones que estén activas o inactivas
// Si estado == true: consulta inactivas
// Si estado == false: consulta activas
router.get('/:usuario/:estadesactivado', async (req, res) => {
    const user = req.params.usuario
    const disabled = req.params.estadesactivado
    const colRef = await db.collection('col1-ubicaciones')
    const query = await colRef
        .where('usuario', '==', user)
        .where('disabled', '==', disabled)
    const call = await query.get()
    if (call.empty) {
        if (disabled) {
            res.send('No hay ubicaciones inactivas')
        } else {
            res.send('No hay ubicaciones activas')
        }
    } else {
        let array = []
        call.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            array.push({ id, data })
        })
        res.send({ array })
    }
})

// Ver mis ubicaciones
router.get('/consultaTodas/:usuario', async (req, res) => {
    const user = req.params.usuario
    const colRef = await db.collection('col1-ubicaciones')
    const query = await colRef.where('usuario', '==', user)
    const call = await query.get()
    if (call.empty) {
        res.send(`El usuario ${user} no tiene ubicaciones`)
    } else {
        let array = []
        call.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            array.push({ id, data })
        })
        res.send({ array })
    }
})

// Ver una ubicacion
router.get('/consultaUna/:ubiid', async (req, res) => {
    // const user = req.params.usu
    const id = req.params.ubiid
    const colRef = await db.collection('col1-ubicaciones')
    const docRef = await colRef.doc(id)
    const call = await docRef.get()
    if (!call.exists) {
        res.send('La ubicacion no existe')
    } else {
        const retrieveId = call.id
        const retrieveData = call.data()
        res.send({ retrieveId, retrieveData })
    }
})


module.exports = {
    routes: router
}