const { Router } = require('express')
const router = Router();

const { db } = require('../firebase')


// Añadir un servicio a una ubicacion
router.post('/:tipo/:ubiid/:usu', async (req, res) => {
    const tipo = req.params.tipo
    const id = req.params.ubiid
    const user = req.params.usu
    const colRef = await db.collection('col2-servicios')
    const query = await colRef
        .where('usuario', '==', user)
        .where('id_ubicacion', '==', id)
        .where('tipo_servicio', '==', tipo)
    const call = await query.get()
    if (!call.empty) {
        res.send('Ya existe el servicio')
    } else {
        await colRef.doc().set({
            usuario: user,
            id_ubicacion: id,
            tipo_servicio: tipo,
            disabled: false
        })
        res.send('El servicio se ha añadido a la base de datos')
    }
})

// Eliminar un servicio a una ubicacion
router.delete('/:servid', async (req, res) => {
    const id = req.params.servid
    const colRef = await db.collection('col2-servicios')
    const docRef = await colRef.doc(id)
    const call = await docRef.get()
    if (!call.exists) {
        res.send(`El servicio ${id} no existe`)
    } else {
        await docRef.delete()
        res.send(`${id} borrado`)
    }
})

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
    res.send({ services })
})

// Consultar qué servicios tiene una ubicacion de un usuario
router.get('/:usu/:ubiid', async (req, res) => {
    const user = req.params.usu
    const id = req.params.ubiid
    const colRef = await db.collection('col2-servicios')
    const query = await colRef
        .where('usuario', '==', user)
        .where('id_ubicacion', '==', id)
    const call = await query.get()
    if (call.empty) {
        res.send(`La ubicacion ${id} no tiene servicios`)
    } else {
        let services = []
        call.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            services.push({ id, data })
        })
        res.send({ services })
    }
})

// Activar o desactivar el servicio de una ubicacion
router.put('/:servid', async (req, res) => {
    const id = req.params.servid
    const colRef = await db.collection('col2-servicios')
    const docRef = await colRef.doc(id)
    const call = await docRef.get()
    if (!call.exists) {
        res.send('No existe el servicio')
    } else {
        const current = call.data().disabled
        const newValue = !current
        await docRef.update({
            disabled: newValue
        })
        res.send(`Servicio ${id} actualizado con éxito`)
    }
})

// Activar o desactivar los servicios de un tipo que tiene el usuario (API selector)
router.put('/:usu/:tipo', async (req, res) => {
    const user = req.params.usu
    const tipo = req.params.tipo
    const colRef = await db.collection('col2-servicios')
    const query = await colRef
        .where('usuario', '==', user)
        .where('tipo_servicio', '==', tipo)
    const call = await query.get()
    if (call.empty) {
        res.send('Error al activar/desactivar servicio')
    } else {
        let servicios = []
        call.forEach((doc) => {
            const id = doc.id
            const data = doc.data()
            servicios.push({ id, data })
        })
        for (let elem of servicios) {
            const current = elem.data.disabled
            const newValue = !current
            await colRef.doc(elem.id).update({
                disabled: newValue
            })
        }
        res.send('Actualizaciones de los servicios hechos')
    }
})


module.exports = {
    routes: router
}