// logicaServicios.js
// Fichero donde se manejará la lógica interna de los servicios de las ubicaciones
// En un principio, las operaciones que no pasan por el router directamente

const { db } = require("./firebase");


// Crear los servicios de cada usuario cuando se crea el mismo
// [A]: 2.
// FUNCIONA
const crearServiciosLocalesUsuario = async (usuario) => {
    const colRef = await db.collection('col4-serviciosLocalesUsuarios')
    const docRef = await colRef.doc(usuario)
    const call = await docRef.get()
    if (!call.exists) {
        await colRef.doc(usuario).set({
            eventos: true,
            noticias: true,
            tiempo: true
        })
    }
}


// Al borrar el usuario, quitar sus servicios de la cuenta
// [B]: 3.
// FUNCIONA
const eliminarServiciosLocalesUsuario = async (usuario) => {
    const colRef = await db.collection('col4-serviciosLocalesUsuarios')
    const docRef = await colRef.doc(usuario)
    const call = await docRef.get()
    if (call.exists) {
        await colRef.doc(usuario).delete()
    }
}


// Activar manualmente el servicio de una ubicacion
// [I]
// FUNCIONA
const activarServicioDeUbicacion = async (usuario, ubicacion, servicio) => {
    // Comprobar que si quiero activar, el selector esté activo
    // TODO
    // ...

    const colRef = await db.collection('col2-servicios')
    const query = await colRef
        .where('usuario', '==', usuario)
        .where('id_ubicacion', '==', ubicacion)
        .where('tipo_servicio', '==', servicio)
    const call = await query.get()
    if (!call.empty) {
        // Solo hay un doc
        let id_servicio
        call.forEach((doc) => {
            id_servicio = doc.id
        })
        await colRef.doc(id_servicio).update({
            disabled: false
        })
    }
}


// Desactivar manualmente el servicio de una ubicacion
// [H]
// FUNCIONA
const desactivarServicioDeUbicacion = async (usuario, ubicacion, servicio) => {
    // Comprobar que si quiero desactivar, el selector esté activo
    // TODO
    // ...

    const colRef = await db.collection('col2-servicios')
    const query = await colRef
        .where('usuario', '==', usuario)
        .where('id_ubicacion', '==', ubicacion)
        .where('tipo_servicio', '==', servicio)
    const call = await query.get()
    if (!call.empty) {
        // Solo hay un doc
        let id_servicio
        call.forEach((doc) => {
            id_servicio = doc.id
        })
        await colRef.doc(id_servicio).update({
            disabled: true
        })
    }
}


// Selector de API: activar todas las APIs del tipo
// [G]: 2.
// FUNCIONA
const activarAPIdelSelector = async (usuario, servicio) => {
    const colRef = await db.collection('col4-serviciosLocalesUsuarios')
    const docRef = await colRef.doc(usuario)
    if (servicio === 'tiempo') {
        await docRef.update({
            tiempo: true
        })
    } else if (servicio === 'eventos') {
        await docRef.update({
            eventos: true
        })
    } else if (servicio === 'noticias') {
        await docRef.update({
            noticias: true
        })
    }
    // Por cada servicio inactivo de cada ubicacion de ese tipo (where usuario/tipo_servicio)
    // Cambiar la flag de cada servicio a false
    const query = await db.collection('col2-servicios')
        .where('usuario', '==', usuario)
        .where('tipo_servicio', '==', servicio)
    const call = await query.get()
    if (!call.empty) {
        let ubicaciones = []
        call.forEach((doc) => {
            const id_ubicacion = doc.data().id_ubicacion
            ubicaciones.push(id_ubicacion)
        })
        for (let id of ubicaciones) {
            await activarServicioDeUbicacion(usuario, id, servicio)
        }
    }
}


// Selector de API: desactivar todas las APIs del tipo
// [G]: 1.
// FUNCIONA
const desactivarAPIdelSelector = async (usuario, servicio) => {
    const colRef = await db.collection('col4-serviciosLocalesUsuarios')
    const docRef = await colRef.doc(usuario)
    if (servicio === 'tiempo') {
        await docRef.update({
            tiempo: false
        })
    } else if (servicio === 'eventos') {
        await docRef.update({
            eventos: false
        })
    } else if (servicio === 'noticias') {
        await docRef.update({
            noticias: false
        })
    }
    // Por cada servicio activo de cada ubicacion de ese tipo (where usuario/tipo_servicio)
    // Cambiar la flag de cada servicio a true
    const query = await db.collection('col2-servicios')
        .where('usuario', '==', usuario)
        .where('tipo_servicio', '==', servicio)
    const call = await query.get()
    if (!call.empty) {
        let ubicaciones = []
        call.forEach((doc) => {
            const id_ubicacion = doc.data().id_ubicacion
            ubicaciones.push(id_ubicacion)
        })
        for (let id of ubicaciones) {
            await desactivarServicioDeUbicacion(usuario, id, servicio)
        }
    }
}


// Iniciar por defecto los servicios en las ubicaciones
// [C]: 2.
// FUNCIONA
const crearServicioEnUbicacion = async (usuario, ubicacion, tipoServicio) => {
    // Sacar el valor del servicio en col4
    const usersServs = await db.collection('col4-serviciosLocalesUsuarios').doc(usuario).get()
    let value = usersServs.get(`${tipoServicio}`)
    // Crear servicio asociado en col2 con el estado que toca
    const colRef = await db.collection('col2-servicios')
    const query = await colRef
        .where('usuario', '==', usuario)
        .where('id_ubicacion', '==', ubicacion)
        .where('tipo_servicio', '==', tipoServicio)
    const call = await query.get()
    if (call.empty) {
        await colRef.doc().set({
            usuario: usuario,
            id_ubicacion: ubicacion,
            tipo_servicio: tipoServicio,
            disabled: !value
        })
    }
}


// Borrar los servicios de una ubicacion
// [D]: 2.
// FUNCIONA
const borrarTodosServiciosDeUbicacion = async (ubicacion) => {
    const colRef = await db.collection('col2-servicios')
    const query = await colRef.where('id_ubicacion', '==', ubicacion)
    const call = await query.get()
    if (!call.empty) {
        let ids_servicios = []
        call.forEach((doc) => {
            const id = doc.id
            ids_servicios.push(id)
        })
        for (let id of ids_servicios) {
            const docRef = await colRef.doc(id)
            await docRef.delete()
        }
    }
}


module.exports = {
    crearServiciosLocalesUsuario,
    eliminarServiciosLocalesUsuario,
    activarServicioDeUbicacion,
    desactivarServicioDeUbicacion,
    activarAPIdelSelector,
    desactivarAPIdelSelector,
    crearServicioEnUbicacion,
    borrarTodosServiciosDeUbicacion
}