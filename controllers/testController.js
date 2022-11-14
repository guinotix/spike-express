const Test = require('../models/testModel')
const db = require("../firebase");
const {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    updateDoc
} = require('firebase/firestore')


// Mirar este método: falla el pathSegment
const addTest = async (req, res, next) => {
    try {
        const data = req.body;
        await setDoc(doc(db, "tests", "identificador") , {
            id: data.id,
            name: data.name,
            author: data.author
        })
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Mirar el pathSegment
const getTest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const testRef = doc(db, "tests", "identificador");
        const testSnap = await getDoc(testRef);
        if(!testSnap.exists()) {
            res.status(404).send('Test not found');
        } else {
            res.send(testSnap.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Funciona
const getAllTests = async (req, res, next) => {
    try {
        const tests = await getDocs(collection(db, "tests"));
        const testsArray = [];
        tests.forEach(doc => {
            const test = new Test(
                doc.data().id,
                doc.data().name,
                doc.data().author
            );
            testsArray.push(test);
        });
        if (testsArray.length === 0) {
            res.status(404).send('No tests found');
        } else {
            res.send(testsArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}


// Mirar el pathSegment
const updateTest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const testRef =  await doc(db, "tests", "identificador");
        await updateDoc(testRef, {
            id: id,
            name: data.name,
            author: data.author
        });
        res.send('Test updated successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Mirar el pathSegment
const deleteTest = async (req, res, next) => {
    try {
        const id = req.params.id;
        const docTestRef = doc(db, "tests", "identificador");
        await deleteDoc(docTestRef);
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