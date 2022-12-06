const { initializeApp } = require("firebase-admin/app");
const { credential } = require("firebase-admin");
const firebaseAdmin = require('./secured/serviceAccountKey.json')
const { getFirestore } = require('firebase-admin/firestore')
const { getAuth } = require("firebase-admin/auth");

initializeApp({
    credential: credential.cert(firebaseAdmin),
    databaseURL: process.env.DATABASE_URL
})

const db = getFirestore()
const auth = getAuth()

module.exports = {
    db, auth
}