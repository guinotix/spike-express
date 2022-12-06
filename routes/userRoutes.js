const { Router } = require('express')
const router = Router();

const { auth } = require('../firebase')


// Register a User
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body
        const userRecord = await auth.createUser({
            email: email,
            password: password
        })
        const userDecoded = {
            uid: userRecord.uid,
            email: userRecord.email,
            passwordEncrypted: userRecord.passwordHash
        }
        console.log(userDecoded)
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
})


// Delete a User
router.get('/deleteUser/:uid', async (req, res) => {
    try {
        const uid = req.params.uid
        await auth.deleteUser(uid)
        console.log('User deleted')
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
})


// List all users
router.get('/users', async (req, res) => {
    try {
        const result = await auth.listUsers()
        let users = []
        result.users.map(user => {
            users.push({
                uid: user.uid,
                email: user.email,
                passwordEncrypted: user.passwordHash
            })
        })
        users.forEach(user => {
            console.log(user)
        })
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
})


module.exports = {
    routes: router
}