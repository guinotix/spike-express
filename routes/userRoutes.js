const { Router } = require('express')
const router = Router();

const { auth } = require('../firebase')


// Register a User
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body
        await auth.createUser({
            email: email,
            password: password
        })
        res.redirect('/auth/users')
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
        res.redirect('/auth/users')
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
                passwordEncrypted: user.passwordHash,
                isDisabled: user.disabled
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


// Get a User by email
router.get('/user', async (req, res) => {
    try {
        const { email } = req.body
        const userRecord = await auth.getUserByEmail(email)
        console.log({
            uid: userRecord.uid,
            email: userRecord.email,
            isDisabled: userRecord.disabled
        })
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
})


// Get a User by UID
router.get('/user/:uid', async (req, res) => {
    try {
        const uid = req.params.uid
        const userRecord = await auth.getUser(uid)
        console.log({
            uid: userRecord.uid,
            email: userRecord.email,
            isDisabled: userRecord.disabled
        })
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
})


// Update Password
router.get('/updatePassword/:uid', async (req, res) => {
    try {
        const uid = req.params.uid
        const { password } = req.body
        await auth.updateUser(uid, {
            password: password
        })
        res.redirect('/auth/users')
    } catch (error) {
        console.log(error.message)
    }
})


// Activate or Deactivate an account
router.get('/userActivation/:uid', async (req, res) => {
    try {
        const uid = req.params.uid
        const userRecord = await auth.getUser(uid)
        if (userRecord.disabled) {
            // Activate
            await auth.updateUser(uid, {
                disabled: false
            })
        } else {
            // Deactivate
            await auth.updateUser(uid, {
                disabled: true
            })
        }
        res.redirect('/auth/users')
    } catch (error) {
        console.log(error.message)
    }
})


module.exports = {
    routes: router
}