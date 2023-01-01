const { Router } = require('express')
const router = Router();

const { db } = require('../firebase')


// Ver si el usuario tiene ubicaciones (metodo de prueba)
router.get('/:usuario', async (req, res) => {
    const user = req.params.usuario
    const ubiUsuColRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones')
    const call = await ubiUsuColRef.get()
    if (call.empty) {
        res.send('No hay ubicaciones')
    } else {
        res.send(`Hay un total de ${call.size} ubicaciones`)
    }
})

// Añadir ubicacion por toponimo
router.post('/:usuario/postT', async (req, res) => {
    const user = req.params.usuario
    const { sitio } = req.body
    const topRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones').doc(sitio)
    const call = await topRef.get()
    if (call.exists) {
        res.send('La ubicacion existe')
    } else {
        await topRef.set({
            toponimo: sitio,
            alias: '',
            disabled: false
        })
        res.send(`${sitio} añadido`)
    }
})

// Añadir ubicacion por coordenadas
router.post('/:usuario/postC', async (req, res) => {
    const user = req.params.usuario
    const { lat, lon } = req.body
    const fsID = `${lat}-${lon}`
    const topRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones').doc(fsID)
    const call = await topRef.get()
    if (call.exists) {
        res.send('La ubicacion existe')
    } else {
        await topRef.set({
            latitud: lat,
            longitud: lon,
            alias: '',
            disabled: false
        })
        res.send(`${fsID} añadido`)
    }
})

// Borrar ubicacion
router.delete('/:usuario/:ubiid', async (req, res) => {
    const user = req.params.usuario
    const id = req.params.ubiid
    const topRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones').doc(id)
    const call = await topRef.get()
    if (!call.exists) {
        res.send('La ubicacion no existe')
    } else {
        await topRef.delete()
        res.send(`${id} borrado`)
    }
})

// Cambiar alias
router.put('/alias/:usuario/:ubiid', async (req, res) => {
    const user = req.params.usuario
    const id = req.params.ubiid
    const { nuevoAlias } = req.body
    const topRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones').doc(id)
    const call = await topRef.get()
    if (!call.exists) {
        res.send('La ubicacion no existe')
    } else {
        await topRef.update({
            alias: nuevoAlias
        })
        res.send(`Alias actualizado. Nuevo alias: ${nuevoAlias}`)
    }
})

// Activar ubicacion
router.put('/activar/:usuario/:ubiid', async (req, res) => {
    const user = req.params.usuario
    const id = req.params.ubiid
    const topRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones').doc(id)
    const call = await topRef.get()
    if (!call.exists) {
        res.send('La ubicacion no existe')
    } else {
        if (call.data().disabled) {
            await topRef.update({
                disabled: false
            })
            res.send('Ubicación activada')
        } else {
            res.send('La ubicación ya está activa')
        }
    }
})

// Desactivar ubicacion
router.put('/desactivar/:usuario/:ubiid', async (req, res) => {
    const user = req.params.usuario
    const id = req.params.ubiid
    const topRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones').doc(id)
    const call = await topRef.get()
    if (!call.exists) {
        res.send('La ubicacion no existe')
    } else {
        if (!call.data().disabled) {
            await topRef.update({
                disabled: true
            })
            res.send('Ubicación desactivada')
        } else {
            res.send('La ubicación ya está inactiva')
        }
    }
})


module.exports = {
    routes: router
}