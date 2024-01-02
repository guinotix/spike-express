const { initializeApp } = require("firebase-admin/app");
const { credential } = require("firebase-admin");
const firebaseAdmin = require('./secured/serviceAccountKey.json')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp({
    credential: credential.cert(firebaseAdmin),
})

const db = getFirestore()

module.exports = { db }