const express = require('express')

const {
    addTest,
    getTest,
    getAllTests,
    updateTest,
    deleteTest
} = require('../controllers/testController')

const router = express.Router();

router.post('/postTest', addTest);
router.get('/getTests', getAllTests);
router.get('/tests/:id', getTest);
router.put('/tests/:id', updateTest);
router.delete('/tests/:id', deleteTest);

module.exports = {
    routes: router
}