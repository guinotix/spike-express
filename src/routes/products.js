const express = require('express')
const products = express.Router()

// GET all
products.get("/", (req, res) => {
    res.send("GET method of products");
})

// GET one
products.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    res.send(`GET method of product ${id}`);
})

// POST a product
products.post("/", (req, res) => {
    const product = req.body;

    // Return a response with code 200 (product added and all the data in a json format in the body)
    res.status(200).json(product);
})

// PUT a product (update)
products.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const product = req.body;

    // Return a repsonse with code 200 and the updated product
    res.status(200).json(product);
})

// DELETE a product
products.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    // findProduct(id)
    // ...

    res.status(200).json(`DELETE method of the product ${id}`);
})

module.exports = products;
