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


// QUERIES
// Obtener ubicaciones que estén activas
router.get('/activas/:usuario', async (req, res) => {
    const user = req.params.usuario
    const ubiUsuColRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones')
    const query = await ubiUsuColRef.where('disabled', '==', false)
    const call = await query.get()
    if (call.empty) {
        res.send('No hay ubicaciones activas')
    } else {
        let array = []
        call.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            array.push({
                id, data
            })
        })
        res.send(array)
    }
})

// Obtener ubicaciones que estén inactivas
router.get('/inactivas/:usuario', async (req, res) => {
    const user = req.params.usuario
    const ubiUsuColRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones')
    const query = await ubiUsuColRef.where('disabled', '==', true)
    const call = await query.get()
    if (call.empty) {
        res.send('No hay ubicaciones inactivas')
    } else {
        let array = []
        call.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            array.push({
                id, data
            })
        })
        res.send(array)
    }
})

// Consultar info de todas las ubicaciones
router.get('/consultaUbicaciones/:usuario', async (req, res) => {
    const user = req.params.usuario
    const ubiUsuColRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones')
    const call = await ubiUsuColRef.get()
    if (call.empty) {
        res.send('No hay ubicaciones')
    } else {
        let places = []
        call.forEach((doc) => {
            const iden = doc.id
            const data = doc.data()
            places.push({
                iden, data
            })
        })
        let services = []
        for (const elem of places) {
            const id = elem.iden
            const servicesQuery = await ubiUsuColRef.doc(id).collection('servicios').get()
            servicesQuery.forEach((serv) => {
                const servID = serv.id
                const servData = serv.data()
                services.push({
                    iden: id, service: { servID, servData }
                })
            })
        }
        let array = places.map((place) => {
            const service = services.find((auxPlace) => auxPlace.iden === place.iden)
            return { ...place, ...service }
        })
        res.send(array)
    }
})

// Consulta info de una ubicacion
router.get('/consultaUna/:usuario/:ubiid', async (req, res) => {
    const user = req.params.usuario
    const ubiid = req.params.ubiid
    const topRef = await db.collection('ubicaciones').doc(user).collection('ubicaciones').doc(ubiid)
    const call = await topRef.get()
    if (!call.exists) {
        res.send('No existe la ubicacion')
    } else {
        let place = [{ id: call.id, data: call.data() }]
        let services = []
        const servicesQuery = await db.collection('ubicaciones').doc(user).collection('ubicaciones').doc(ubiid).collection('servicios').get()
        servicesQuery.forEach((serv) => {
            services.push({
                id: call.id, service: { id: serv.id, data: serv.data() }
            })
        })
        let array = place.reduce((combined, obj1) => {
            const filtered = services.filter((obj) => obj.id === obj1.id)
            let merged = { ...obj1 }
            let placeServices = []
            filtered.forEach((obj2) => {
                if (obj2.service) {
                    placeServices.push(obj2.service)
                }
            })
            merged.services = placeServices
            return merged
        }, {})
        res.send(array)
    }
})


module.exports = {
    routes: router
}