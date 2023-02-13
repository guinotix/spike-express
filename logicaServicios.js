// logicaServicios.js
// Fichero donde se manejará la lógica interna de los servicios de las ubicaciones
// En un principio, las operaciones que no pasan por el router directamente

const { db } = require("./firebase");


// Crear los servicios de cada usuario cuando se crea el mismo
// [A]: 2.
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
const activarServicioDeUbicacion = async (usuario, ubicacion, servicio) => {

}


// Desactivar manualmente el servicio de una ubicacion
// [H]
const desactivarServicioDeUbicacion = async (usuario, ubicacion, servicio) => {

}


// Selector de API: activar todas las APIs del tipo
// [G]: 2.
const activarAPIdelSelector = async (usuario, servicio) => {

}


// Selector de API: desactivar todas las APIs del tipo
// [G]: 1.
const desactivarAPIdelSelector = async (usuario, servicio) => {

}


// Iniciar por defecto los servicios en las ubicaciones
// [C]: 2.
const crearServicioEnUbicacion = async (usuario, ubicacion, tipoServicio) => {

}


// Borrar los servicios de una ubicacion
// [D]: 2.
const borrarTodosServiciosDeUbicacion = async (ubicacion) => {

}