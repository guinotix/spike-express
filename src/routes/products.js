const express = require('express')
const products = express.Router()

const { db } = require('../../firebase')

// GET all
products.get("/", async (req, res) => {
    // res.send("GET method of products");
    try {
        const result = await db.collection('products').get()
        const tests = result.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }))
        res.json(tests)
    } catch (error) {
        res.status(500).send(error)
    }
})

// GET one
products.get("/:id", async (req, res) => {
    try {
        const id = req.params.id
        const doc = await db.collection('products').doc(id).get()
        res.json({ id, ...doc.data() })
    } catch (error) {
        res.status(404).send(error)
    }
})

// POST a product
products.post("/", async (req, res) => {
    const { name, description, price, quantity } = req.body;
    try {
        const colRef = await db.collection('products')
        const docRef = await colRef.doc()
        await docRef.set({ name, description, price, quantity })
        res.json({ id: docRef.id, ...req.body })
    } catch (error) {
        res.status(500).send(error)
    }
})

// PUT a product (update)
products.put("/:id", async (req, res) => {
    const id = req.params.id
    const { name, description, price, quantity } = req.body;
    try {
        const colRef = await db.collection('products')
        const docRef = await colRef.doc(id)
        await docRef.update({ name, description, price, quantity })
        res.json({ id: docRef.id, ...req.body })
    } catch (error) {
        res.status(500).send(error)
    }
})

// DELETE a product
products.delete("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const colRef = await db.collection('products')
        const docRef = await colRef.doc(id)
        const doc = await docRef.get()
        await docRef.delete()
        res.json({ id: id, ...doc.data() })
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = products;
