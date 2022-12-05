const { Router } = require('express')
const router = Router();

const { db } = require('../firebase')


router.post('/postTest', async (req, res) => {
    const { id, name, author } = req.body
    await db.collection('tests').add({
        id, name, author
    })
    res.redirect('/tests')
});

router.get('/tests', async (req, res) => {
    try {
        const result = await db.collection('tests').get()
        const tests = result.docs.map((doc) => ({
            unique: doc.id,
            ...doc.data()
        }))
        console.log(tests)
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
});

router.get('/tests/:id', async (req, res) => {
    try {
        const id = req.params.id
        const doc = await db.collection('tests').doc(id).get()
        console.log(doc.data())
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
});

router.get('/updateTest/:id', async (req, res) => {
    try {
        const { name, author } = req.body
        await db.collection('tests').doc(req.params.id).update(
            { name, author })

        res.redirect('/tests')
    } catch (error) {
        console.log(error.message)
    }
});

router.get('/deleteTest/:id', async (req, res) => {
    try {
        await db.collection('tests').doc(req.params.id).delete()
        res.redirect('/tests')
    } catch (error) {
        console.log(error.message)
    }});


module.exports = {
    routes: router
}