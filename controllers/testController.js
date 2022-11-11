const Test = require('../models/testModel')
const { db } = require("../firebase");

const addTest = async (req, res, next) => {
    try {
        const data = req.body;
        await db.collection('tests').doc().set(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getTest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const test = await db.collection('tests').doc(id);
        const data = await test.get();
        if(!data.exists) {
            res.status(404).send('Test not found');
        } else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllTests = async (req, res, next) => {
    try {
        const tests = await db.collection('tests');
        const data = await tests.get();
        const testsArray = [];
        if(data.empty) {
            res.status(404).send('No tests found');
        }else {
            data.forEach(doc => {
                const test = new Test(
                    doc.id,
                    doc.data().name,
                    doc.data().author,
                );
                testsArray.push(test);
            });
            res.send(testsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const updateTest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const test =  await db.collection('tests').doc(id);
        await test.update(data);
        res.send('Test updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteTest = async (req, res, next) => {
    try {
        const id = req.params.id;
        await db.collection('tests').doc(id).delete();
        res.send('Test deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addTest,
    getTest,
    getAllTests,
    updateTest,
    deleteTest
}