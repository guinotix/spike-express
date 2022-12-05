
const { initializeApp } = require("firebase-admin/app");
const { credential } = require("firebase-admin");
const firebaseAdmin = require('./secured/serviceAccountKey.json')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp({
    credential: credential.cert(firebaseAdmin),
    databaseURL: "https://re-up-date-test-default-rtdb.europe-west1.firebasedatabase.app"
})

const db = getFirestore()

module.exports = {
    db
}